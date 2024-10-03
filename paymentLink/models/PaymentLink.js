// const { nano } = require('../../common/couchdb'); // Import the CouchDB connection
const DB = require("../../common/couchdb")
var Validator = require('jsonschema').Validator;
var v = new Validator();
const Joi = require('joi');

// JSON Schema
const generated_payment_link_validation = Joi.object({

    collectionName: Joi.string().valid('PaymentLink', 'SharingInfo', 'Channels').required(),
    lead: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required().messages({
            'string.email': 'Email must be a valid email',
        }),
        phone: Joi.object({
            countryCode: Joi.number().required().allow('').allow(null),
            phoneNo: Joi.number().required().allow('').allow(null).messages({
                'number.base': 'Phone must be a valid number',
            }),
            contactedNumber: Joi.string().allow('').allow(null),
            countryName: Joi.string().allow('').allow(null)
        }).required(),
        // phone: Joi.string().required(),
        // source: Joi.object().required()
        source: Joi.object()

    }).required(),

    // payee: Joi.object({
    //     name: Joi.string().required(),
    //     email: Joi.string().email().required(),
    //     phone: Joi.object({
    //         countryCode: Joi.number().required(), //91
    //         phoneNo: Joi.number().required(), //9876543210
    //         contactedNumber: Joi.string().required() //+919876543210
    //     }).required(),
    // }).required(),

    payee: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.object({
            countryCode: Joi.number().required().allow('').allow(null),
            phoneNo: Joi.number().required().allow('').allow(null),
            contactedNumber: Joi.string().allow('').allow(null)
        }).required(),
        // phone: Joi.string().required()
    }),

    channelInfo: Joi.object().required(),
    courseType: Joi.string().valid('standalone', 'package', 'bootcamp').required(),
    courseInfo: Joi.object({
        lsSaId: Joi.number().required(),
        apId: Joi.number().required(),
        label: Joi.string().required()
    }),

    coursePlanInfo: Joi.object(), // all information send by ls/sa
    // coursePlanInfo: Joi.object().required(), // all information send by ls/sa
    price: Joi.object({
        originalPrice: Joi.number().required().messages({
            'number.base': 'OriginalPrice must be a valid number',
        }),
        salesPrice: Joi.number().required().messages({
            'number.base': 'SalesPrice must be a valid number',
        }),
        paymentToBeCollected: Joi.number().required().messages({
            'number.base': 'PaymentToBeCollected must be a valid number',
        }),
        paymentType: Joi.string().required(),
        paymentTypeId: Joi.allow(null),
    }),
    paymentCollectedBy: Joi.object({
        refId: Joi.number().allow(null).optional(),
        name: Joi.string().required(),
        email: Joi.string().email().required().allow(null),
        // phone: Joi.object({
        //     countryCode: Joi.number().required().allow('').allow(null),
        //     phoneNo: Joi.number().required().allow('').allow(null),
        //     contactedNumber: Joi.string().allow('').allow(null)
        // }).required(),
        phone: Joi.string().required().allow(null, ''),
    }),
    linkGeneratedBy: Joi.object({
        refId: Joi.number().allow(null).optional(),
        name: Joi.string().allow(''),
        email: Joi.string().allow(''),
        phone: Joi.object({
            countryCode: Joi.number().required().allow('').allow(null),
            phoneNo: Joi.number().required().allow('').allow(null),
            contactedNumber: Joi.string().allow('').allow(null)
        }).required(),
        // phone: Joi.string().allow(''),
        // otherInfo: Joi.object().required() // adjust the validation for otherInfo as needed
        otherInfo: Joi.object().allow('') // adjust the validation for otherInfo as needed
    }),
    selectedPaymentGateways: Joi.array().items(Joi.string().valid('cashfree', 'razorpay')), // adjust validation as needed
    paymentCapturedInfo: Joi.object({
        gatewayName: Joi.string().required(),
        gatewayOrderRef: Joi.string(),
        gatewayPaymentRef: Joi.string(),
        otherInfo: Joi.object(), // adjust validation for otherInfo as needed
        updatedFrom: Joi.string().valid('instant', 'webhook')
    }),
    // paymentLink: Joi.string().required(), // adjust validation for uniqueness
    paymentLink: Joi.string(),
    // paymentLink: Joi.string().required(),  
    paymentLinkGeneratedTime: Joi.date().required(),
    paymentLinkExpireTime: Joi.date().allow(null),
    paymentCaptureTime: Joi.date(),
    currentStatus: Joi.array().items(
        'generated', 'shared', "processing", 'paid', 'expired', 'initiated', 'error', 'cancelled', 'deleted'
    ).required(),
    statusChangeHistory: Joi.array().items(Joi.object({
        statusName: Joi.string().required(),
        changeTime: Joi.date().required(),
        changedBy: Joi.object({
            refId: Joi.number().allow(null).optional(),
            name: Joi.string().allow(''),
            email: Joi.string().email().allow(''),
            phone: Joi.object({
                countryCode: Joi.number().required().allow('').allow(null),
                phoneNo: Joi.number().required().allow('').allow(null),
                contactedNumber: Joi.string().allow('').allow(null)
            }).required(),
            // phone: Joi.string().allow(''),
            otherInfo: Joi.object() // adjust the validation for otherInfo as needed
        }),
        message: Joi.object({
            code: Joi.string().required(),
            text: Joi.string().required()
        })
    })),

    approvalStatus: Joi.string().valid(
        'approved', 'rejected', 'pending', 'na'
    ).required(),

    // approvalStatusChangeHistory: Joi.object({
    //     statusName: Joi.string().required(),
    //     changeTime: Joi.date().required(),
    //     changedBy: Joi.object({
    //         refId: Joi.number().allow(null).optional(),
    //         name: Joi.string().required(),
    //         email: Joi.string().email().required(),
    //         phone: Joi.object({
    //             countryCode: Joi.number().required(),
    //             phoneNo: Joi.number().required(),
    //             contactedNumber: Joi.string().required()
    //         }).required(),
    //         otherInfo: Joi.object().required() // adjust the validation for otherInfo as needed
    //     }),
    //     message: Joi.object({
    //         code: Joi.string().required(),
    //         text: Joi.string().required()
    //     }),
    // }),
    approvalStatusChangeHistory: Joi.array().items(Joi.object({
        statusName: Joi.string().required(),
        changeTime: Joi.date().required(),
        changedBy: Joi.object({
            refId: Joi.number().allow(null).optional(),
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.object({
                countryCode: Joi.number().required().allow('').allow(null),
                phoneNo: Joi.number().required().allow('').allow(null),
                contactedNumber: Joi.string().allow('').allow(null)
            }).required(),
            otherInfo: Joi.object().required() // adjust the validation for otherInfo as needed
        }),
        message: Joi.object({
            code: Joi.string().required(),
            text: Joi.string().required()
        })

    })),

    dataModified: Joi.boolean().default(false),
    isRevenueAddedSendToQueue: Joi.boolean().default(null),
    isRevenueUpdatedSendToQueue: Joi.boolean().default(null),
    editApprovelStatus: Joi.string().valid(
        'pending', 'na'
    ),
    sharingEmail: Joi.string(),
    pageContent: Joi.string().allow('').allow(null),
    token: Joi.string(),
    order_id: Joi.number().allow('').allow(null),
});


const generated_payment_link_validation_insertItem = async (item = {}) => {
    item = { ...item };
    const result = generated_payment_link_validation.validate(item);

    if (result.error) {
        return {
            "error": result.error
        };
    }

    const response = await DB.insert(item);
    return response;
}

// this function is written to update the payment link
const update_payment_link_validation_insertItem = async (item = {}, id) => {
    item = { ...item };
    const result = generated_payment_link_validation.validate(item);

    if (result.error) {
        return {
            "error": result.error
        };
    }

    const response = await DB.insert(item, id);
    return response;
}




module.exports = {
    generated_payment_link_validation_insertItem,
    update_payment_link_validation_insertItem
}