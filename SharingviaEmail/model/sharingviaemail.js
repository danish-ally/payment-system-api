const DB = require("../../common/couchdb")
var Validator = require('jsonschema').Validator;
var v = new Validator();
const Joi = require('joi');

// JSON Schema
const ShareviaEmail = Joi.object({
    collectionName: Joi.string().valid('ShareviaEmail').required(),
    paymentLinkRefId: Joi.string().min(1).required(),
    email: Joi.string(), 
});


const shareviaemail_insertitem = async (item = {}) => {
    item = { ...item };
    const result = ShareviaEmail.validate(item);

    if (result.error) {
        return {
            "error": result.error
        };
    }

    const response = await DB.insert(item);
    return response;
}

module.exports = {
    shareviaemail_insertitem
}