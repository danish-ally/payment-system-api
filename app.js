const { port } = require("./common/config/key");
// require("./common/redis");
const express = require("express");
const redis = require("redis");
const app = express();
require('dotenv').config();
const cors = require('cors');
const Sentry = require("@sentry/node");
const { ProfilingIntegration } = require("@sentry/profiling-node");


Sentry.init({
  dsn: process.env.SENTRY_DNS,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { db } = require('./common/couchdb'); // Import the CouchDB connection

const paymentLinkRoutes = require("./paymentLink/routes/PaymentLinkRoutes")
const shareviaemail = require("./SharingviaEmail/routes/sharingviaemailroutes")
const razorpay = require("./Razorpay/routes/razorpayroutes")
const cashfree = require("./Cashfree/routes/cashfreeroutes")
const log = require('./log/routes/logRoutes')

// this api is used to redirect to payment link 
// const paymentLinkController = require('./paymentLink/controller/v1/PaymentLinkController');
// app.get("/payment/:shortUrl", paymentLinkController.redirect_payment_Url);
// End


// Routes
app.use("/api/v1/paymentLink", paymentLinkRoutes);
app.use("/api/v1/shareviaemail", shareviaemail);
app.use("/api/v1/razorpay", razorpay);
app.use("/api/v1/cashfree", cashfree);
app.use("/api/v1/log", log);





// Define routes that interact with CouchDB
app.get("/documents", async (req, res) => {
  // Example: Fetch documents from the database
  db.list({ include_docs: true }, (err, body) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: 'Error fetching documents' });
    }
    res.json(body.rows.map((row) => row.doc));
  });
});

//swaggerImports
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./api.yaml");

const externalRoutes = require("./External/routes/externalRoute");
app.use("/api/v1/external", externalRoutes);

// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

app.get("/debug-sentry", function mainHandler(req, res) {
  console.log("hit")
  throw new Error("Danish first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(new Date())
  console.log(
    "You can have Api docs from here ➡️  http://localhost:9005/api-docs/ and after  clicking on this link select HTTP"
  );
});

module.exports = app;