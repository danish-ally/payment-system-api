const { nano } = require('../../common/couchdb'); // Import the CouchDB connection
const Joi = require('joi');

// JSON Schema
const sharingInfoSchema = Joi.object({
    collectionName: Joi.string().valid('PaymentLink', 'SharingInfo', 'Channels').required(),
    paymentLinkRefId: Joi.string().min(1).required(),
    sharingViaEmail: Joi.object({
        email: Joi.string(),
        status: Joi.string(),
        emailProvider: Joi.number().integer(),
        triggerTime: Joi.date(),
        deliveryTime: Joi.date(),
        emailTemplate: Joi.string()
    }),
    sharingViaWhatsApp: {
        phone: {
            countryCode: Joi.number().integer(), //91
            phoneNo: Joi.number().integer(), //9876543210
            contactedNUmber: Joi.string(), //+919876543210
        },
        serviceProvider: Joi.string(),
        triggerTime: Joi.date(),
        deliveryTime: Joi.date(),
        template: Joi.string()
    },
    sharingViaSms : {
        phone: {
            countryCode: Joi.number().integer(), //91
            phoneNo: Joi.number().integer(), //9876543210
            contactedNUmber: Joi.string(), //+919876543210
        },
        serviceProvider: Joi.string(),
        triggerTime: Joi.date(),
        deliveryTime: Joi.date(),
        template: Joi.string()
    }
});