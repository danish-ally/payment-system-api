const { nano } = require('../../common/couchdb'); // Import the CouchDB connection
const Joi = require('joi');


// JSON Schema
const smsTemplateSchema = Joi.object({
    collectionName: Joi.string().valid('PaymentLink', 'SharingInfo', 'Channels').required(),
    templateName: Joi.string(),
    subject: Joi.string(),
    template: Joi.string(),
    dynamicValues: Joi.array().items(
        Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string()
        })
    ),
    status: Joi.string().valid('active', 'pending').required() 
});