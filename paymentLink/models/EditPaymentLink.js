const DB = require("../../common/couchdb")
var Validator = require('jsonschema').Validator;
var v = new Validator();
const Joi = require('joi');

const editPaymentSchema = Joi.object({
    collectionName: Joi.string().valid('EditPaymentLink'),
    paymentLinkId: Joi.string().required(),
    changeRequest: Joi.object().required(),
    createdAt: Joi.date().required(),
    createdBy: Joi.object({
        refId: Joi.number().allow(null),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.object({
            countryCode: Joi.number().allow(null),
            phoneNo: Joi.number().allow(null),
            contactedNumber: Joi.string().allow(null),
        }).required(),
    }).required(),
    status: Joi.string().valid('Active', 'Deleted').required(),
});

const edit_payment_link_validation_insertItem = async (item = {}) => {
    item = { ...item };
    const result = editPaymentSchema.validate(item);

    if (result.error) {
        return {
            "error": result.error
        };
    }

    const response = await DB.insert(item);
    return response;
}

module.exports = {
    edit_payment_link_validation_insertItem
}