const axios = require('axios');
const { LAWSIKHO_CASHFREE_CLIENT_ID, LAWSIKHO_CASHFREE_CLIENT_SECRET, SKILLARBITAGE_CASHFREE_CLIENT_ID, SKILLARBITAGE_CASHFREE_CLIENT_SECRET } = process.env;
const DB = require("../../../common/couchdb")
const Joi = require('joi');

//To Successfully initiate the Payment
// const initiatePayment = async (req, res) => {
//     try {


//       const url = 'https://sandbox.cashfree.com/pg/orders';

//       const response = await axios.post(
//         url,
//         // req.body,
//         {
//             customer_details: {
//               customer_id: req.body.customer_details.customer_id,
//               customer_email: req.body.customer_details.customer_email,
//               customer_phone: req.body.customer_details.customer_phone,
//               customer_name: req.body.customer_details.customer_name,
//             },
//             order_meta: {
//               notify_url: req.body.order_meta.notify_url,
//               payment_methods: req.body.order_meta.payment_methods
//             },
//             order_id: 'ORID665456' + Date.now(),
//             order_amount: req.body.order_amount,
//             order_currency: "INR",
//             order_note: req.body.order_note,
//             notes: req.body.notes || {},
//           },
//         {
//           headers: {
//             'x-client-id': CASHFREE_CLIENT_ID,
//             'x-client-secret': CASHFREE_CLIENT_SECRET,
//             'Content-Type': 'application/json',
//             'x-api-version':'2022-09-01'
//           },
//         }
//       );

//       res.json({ success: true, data: response.data });
//     } catch (error) {
//       console.error(error.response.data.message);
//       res.status(500).json({ success: false, error: error.response.data.message });

//     }
//   };

// const initiatePayment = async (req, res) => {
//   try {
//     // const url = 'https://sandbox.cashfree.com/pg/orders';
//     const url = process.env.CASHFREE_ORDER_URL

//     // Assuming channelId is a property in req.body
//     const channelId = req.body.channelId;

//     let client_id, client_secret;

//     if (channelId == 1) {
//       client_id = LAWSIKHO_CASHFREE_CLIENT_ID;
//       client_secret = LAWSIKHO_CASHFREE_CLIENT_SECRET;
//     } else if (channelId == 2) {
//       client_id = SKILLARBITAGE_CASHFREE_CLIENT_ID;
//       client_secret = SKILLARBITAGE_CASHFREE_CLIENT_SECRET;
//     } else {
//       client_id = LAWSIKHO_CASHFREE_CLIENT_ID;
//       client_secret = LAWSIKHO_CASHFREE_CLIENT_SECRET;
//     }

//     const requestPayload = {
//       // ... (unchanged code)
//       customer_details: {
//         customer_id: req.body.customer_details.customer_id,
//         customer_email: req.body.customer_details.customer_email,
//         customer_phone: req.body.customer_details.customer_phone,
//         customer_name: req.body.customer_details.customer_name,
//       },
//       order_meta: {
//         notify_url: req.body.order_meta.notify_url,
//         payment_methods: req.body.order_meta.payment_methods
//       },
//       order_id: 'ORID665456' + Date.now(),
//       order_amount: req.body.order_amount,
//       order_currency: "INR",
//       order_note: req.body.order_note,

//       // Include the "notes" property from the request body
//       notes: req.body.notes || {},
//       planId: req.body.planId,
//       system: "Paymentsystem"
//     };

//     const response = await axios.post(
//       url,
//       requestPayload,
//       {
//         headers: {
//           'x-client-id': client_id,
//           'x-client-secret': client_secret,
//           'Content-Type': 'application/json',
//           'x-api-version': '2022-09-01'
//         },
//       }
//     );


//     const logPayload = { response: response }
//     logPayload.timestamp = new Date()
//     logPayload.collectionName = 'Log'
//     logPayload.paymentGatewayName = 'cashfree'
//     logPayload.paymentLinkId = req.body.customer_details?.customer_id
//     logPayload.tag = 'initiate_payment'
//     const logResponse = await DB.insert(logPayload);

//     // Check the response and send appropriate status and message
//     if (logResponse.hasOwnProperty("ok")) {
//       console.log("Log created sucessfully")
//     } else {
//       console.log("Log not created")
//     }


//     // Include the "notes" property in the response
//     const responseData = {
//       success: true,
//       data: {
//         ...response.data,
//         // Include the "notes" property from the request body
//         notes: req.body.notes || {},
//         planId: req.body.planId,
//         system: "Paymentsystem"
//       },
//     };

//     res.json(responseData);
//   } catch (error) {
//     //console.error(error.response.data.message);

//     const logPayload = { response: error?.response?.data }
//     logPayload.timestamp = new Date()
//     logPayload.collectionName = 'Log'
//     logPayload.paymentGatewayName = 'cashfree'
//     logPayload.paymentLinkId = req.body.customer_details?.customer_id
//     logPayload.tag = 'initiate_payment'
//     const logResponse = await DB.insert(logPayload);

//     // Check the response and send appropriate status and message
//     if (logResponse.hasOwnProperty("ok")) {
//       console.log("Log created sucessfully")
//     } else {
//       console.log("Log not created")
//     }

//     res.status(500).json({ success: false, error: error });
//   }
// };

const initiatePayment = async (req, res) => {


  // Define Joi schema for email validation
  const emailSchema = Joi.string().email().required();

  // Validate the email
  const validationResult = emailSchema.validate(req.body.customer_details.customer_email);

  console.log("before chnges")

  if (validationResult.error) {
    console.error("Invalid email:", validationResult.error.message);
    return res.status(400).send({ success: false, msg: 'Please provide a valid email' });
  }
  console.log("affter chnges")

  try {
    // const url = 'https://sandbox.cashfree.com/pg/orders';
    const url = process.env.CASHFREE_ORDER_URL

    // Assuming channelId is a property in req.body
    const channelId = req.body.channelId;

    let client_id, client_secret;

    if (channelId == 1) {
      client_id = LAWSIKHO_CASHFREE_CLIENT_ID;
      client_secret = LAWSIKHO_CASHFREE_CLIENT_SECRET;
    } else if (channelId == 2) {
      client_id = SKILLARBITAGE_CASHFREE_CLIENT_ID;
      client_secret = SKILLARBITAGE_CASHFREE_CLIENT_SECRET;
    } else {
      client_id = LAWSIKHO_CASHFREE_CLIENT_ID;
      client_secret = LAWSIKHO_CASHFREE_CLIENT_SECRET;
    }

    const requestPayload = {
      // ... (unchanged code)
      customer_details: {
        customer_id: req.body.customer_details.customer_id,
        customer_email: req.body.customer_details.customer_email,
        customer_phone: req.body.customer_details.customer_phone,
        customer_name: req.body.customer_details.customer_name,
      },
      order_meta: {
        notify_url: req.body.order_meta.notify_url,
        payment_methods: req.body.order_meta.payment_methods
      },
      order_id: 'ORID665456' + Date.now(),
      order_amount: req.body.order_amount,
      order_currency: "INR",
      order_note: req.body.order_note,

      // Include the "notes" property from the request body
      notes: req.body.notes || {},
      planId: req.body.planId,
      system: "Paymentsystem"
    };

    const response = await axios.post(
      url,
      requestPayload,
      {
        headers: {
          'x-client-id': client_id,
          'x-client-secret': client_secret,
          'Content-Type': 'application/json',
          'x-api-version': '2022-09-01'
        },
      }
    );

    //Log Added
    const logPayload = { response: response.data }
    logPayload.timestamp = new Date()
    logPayload.collectionName = 'Log'
    logPayload.paymentGatewayName = 'cashfree'
    logPayload.paymentLinkId = req.body.customer_details?.customer_id
    logPayload.tag = 'initiate_payment'
    console.log(logPayload, "logPayload")
    const logResponse = await DB.insert(logPayload);

    console.log(logResponse, "logResponse")
    // Check the response and send appropriate status and message
    if (logResponse.hasOwnProperty("ok")) {
      console.log("Log created sucessfully")
    } else {
      console.log("Log not created")
    }


    // Include the "notes" property in the response
    const responseData = {
      success: true,
      data: {
        ...response.data,
        // Include the "notes" property from the request body
        notes: req.body.notes || {},
        planId: req.body.planId,
        system: "Paymentsystem"
      },
    };

    res.json(responseData);
  } catch (error) {
    const logPayload = { response: error?.response?.data }
    logPayload.timestamp = new Date()
    logPayload.collectionName = 'Log'
    logPayload.paymentGatewayName = 'cashfree'
    logPayload.paymentLinkId = req.body.customer_details?.customer_id
    logPayload.tag = 'initiate_payment'
    const logResponse = await DB.insert(logPayload);

    // Check the response and send appropriate status and message
    if (logResponse.hasOwnProperty("ok")) {
      console.log("Log created sucessfully")
    } else {
      console.log("Log not created")
    }

    res.status(500).json({ success: false, error: error });
  }
};



//Testing
const checkStatus = async (req, res) => {
  const orderid = req.params.orderid
  console.log(orderid)
  try {
    const options = {
      method: 'GET',
      url: `https://sandbox.cashfree.com/pg/orders/${orderid}`,
      headers: {
        accept: 'application/json',
        'x-api-version': '2022-09-01',
        'x-client-id': CASHFREE_CLIENT_ID,
        'x-client-secret': CASHFREE_CLIENT_SECRET
      }
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (response.data.order_status === "PAID") {
          return res.redirect('http://localhost:3000/success')
        } else if (response.data.order_status === "ACTIVE") {
          return res.redirect(`http://localhost:3000/${response.data.payment_session_id}`)
        } else {
          return res.redirect('http://localhost:3000/failure')
        }
      })
      .catch(function (error) {
        return console.error(error);
      });

  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false
    })
  }
}



module.exports = {
  initiatePayment,
  checkStatus
};