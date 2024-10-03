// const { nano } = require('../../common/couchdb'); // Import the CouchDB connection
const DB = require("../../common/couchdb")
var Validator = require('jsonschema').Validator;
var v = new Validator();
const Joi = require('joi');

// JSON Schema
const logSchema_validation = Joi.object({
    collectionName: Joi.string().valid('Log'),
    timestamp: Joi.date().required(),
    response: Joi.object(),
    paymentGatewayName: Joi.string().valid('cashfree', 'razorpay'),
    tag: Joi.string().valid('order_create', 'get_order_details_by_id', 'capture_payment', 'initiate_payment')
});






module.exports = {
    logSchema_validation
}
