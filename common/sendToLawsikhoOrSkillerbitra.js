const axios = require('axios');
const sendToRevenueSystem = require('./sendToRevenueSystem');
const pushToQueue = require('./pushToQueue');

const sendToLawsikhoOrSkillerbitra = async (payload, existingDoc, paymentOrderDetils) => {

    console.log("heyyyy", existingDoc)
    const paymentType = existingDoc.price.paymentTypeId
    payload.phone = payload.phone.toString()
    if (existingDoc.order_id) {
        payload.order_id = existingDoc.order_id
        payload.data[0].order_id = existingDoc.order_id
    }

    console.log("payload from", payload)


    var modeOfPayment;


    if (existingDoc?.paymentCapturedInfo.gatewayName == 'cashfree') {

        console.log(" cashfree paymentOrderDetils", paymentOrderDetils)
        modeOfPayment = 3

        if (existingDoc.order_id) {
            const MQPayload =
                [
                    {
                        "send_url": `${process.env.BASE_URL_GATEWAY}/api/reffaral/sub/paymentsystem`,
                        "payload": payload,
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "userid": existingDoc.linkGeneratedBy.refId,
                            "user-email": existingDoc.linkGeneratedBy.email,
                            "user-details": `{"user_id":${existingDoc.linkGeneratedBy?.refId},"name":${existingDoc.linkGeneratedBy?.name},"email":${existingDoc.linkGeneratedBy?.email},"phone": ${existingDoc.linkGeneratedBy?.phone?.phoneNo}}`
                        },
                        "ack_url": ""
                    }
                ]

            console.log("MQPayload:", MQPayload)

            const queueResponse = await pushToQueue(MQPayload)
        } else {
            const MQPayload =
                [
                    {
                        "send_url": `${process.env.BASE_URL_GATEWAY}/api/payment/online/add`,
                        "payload": payload,
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "userid": existingDoc.linkGeneratedBy.refId,
                            "user-email": existingDoc.linkGeneratedBy.email,
                            "user-details": `{"user_id":${existingDoc.linkGeneratedBy?.refId},"name":${existingDoc.linkGeneratedBy?.name},"email":${existingDoc.linkGeneratedBy?.email},"phone": ${existingDoc.linkGeneratedBy?.phone?.phoneNo}}`
                        },
                        "ack_url": ""
                    }
                ]

            console.log("MQPayload:", MQPayload)

            const queueResponse = await pushToQueue(MQPayload)
        }
    }

    if (existingDoc?.paymentCapturedInfo.gatewayName == 'razorpay') {

        console.log(" razorpay paymentOrderDetils", paymentOrderDetils)
        console.log("payload", payload)
        modeOfPayment = 9



        if (existingDoc.order_id) {
            const MQPayload =
                [
                    {
                        "send_url": `${process.env.BASE_URL_GATEWAY}/api/reffaral/sub/paymentsystem`,
                        "payload": payload,
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "userid": existingDoc.linkGeneratedBy.refId,
                            "user-email": existingDoc.linkGeneratedBy.email,
                            "user-details": `{"user_id":${existingDoc.linkGeneratedBy?.refId},"name":${existingDoc.linkGeneratedBy?.name},"email":${existingDoc.linkGeneratedBy?.email},"phone": ${existingDoc.linkGeneratedBy?.phone?.phoneNo}}`
                        },
                        "ack_url": ""
                    }
                ]

            const queueResponse = await pushToQueue(MQPayload)
        } else {
            const MQPayload =
                [
                    {
                        "send_url": `${process.env.BASE_URL_GATEWAY}/api/payment/online/add`,
                        "payload": payload,
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "userid": existingDoc.linkGeneratedBy.refId,
                            "user-email": existingDoc.linkGeneratedBy.email,
                            "user-details": `{"user_id":${existingDoc.linkGeneratedBy?.refId},"name":${existingDoc.linkGeneratedBy?.name},"email":${existingDoc.linkGeneratedBy?.email},"phone": ${existingDoc.linkGeneratedBy?.phone?.phoneNo}}`
                        },
                        "ack_url": ""
                    }
                ]

            const queueResponse = await pushToQueue(MQPayload)
        }

    }




}

module.exports = sendToLawsikhoOrSkillerbitra