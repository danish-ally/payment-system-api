const { nano } = require('../../common/couchdb'); // Import the CouchDB connection
const Joi = require('joi');



// JSON Schema
const channelInfoSchema = Joi.object({
    collectionName: Joi.string().valid('PaymentLink', 'SharingInfo', 'Channels').required(),
    name: Joi.string().valid('lawsikho', 'skillarbitrage').required(),
    label: Joi.string(),
    apRefId: Joi.string(),
    lsSaRefId: Joi.string(),
    domain: Joi.string().valid('https://payment-collect1.lawsikho.dev/', 'https://payment-collect2.lawsikho.dev/').required(),
    apiUrl: Joi.string().valid('https://lawsikho-frontend-development.lawsikho.dev/', 'https://skillarbitra-frontend-development.lawsikho.dev/').required()
});

