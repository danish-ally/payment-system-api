const nano = require('nano')(process.env.COUCHDB_URL); // Change the URL if your CouchDB is running elsewhere
const dbName = process.env.DATABASE_NAME; // Replace with your desired database name

// Create a database if it doesn't exist
nano.db.create(dbName, (err) => {
  if (err) {
    console.log(`Database ${dbName} already exists.`);
  } else {
    console.log(`Database ${dbName} created.`);
  }
});

const db = nano.use(dbName);

module.exports = db;