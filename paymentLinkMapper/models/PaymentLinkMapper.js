const DB = require("../../common/couchdb"); // Import the CouchDB connection
const Joi = require('joi');

// JSON Schema
const generated_payment_link_mapper_validation = Joi.object({
    collectionName: Joi.string().valid('PaymentLink', 'SharingInfo', 'Channels', 'paymentlinkmapper').required(),
    link: Joi.string(),
    shortUrl: Joi.string()
});

const generate_payment_link_mapper = async (item = {}) => {
    item = { ...item };
    const result = generated_payment_link_mapper_validation.validate(item);

    if (result.error) {
        return {
            "error": result.error
        };
    }

    const response = await DB.insert(item);
    return response;
}

module.exports = {
    generate_payment_link_mapper
}