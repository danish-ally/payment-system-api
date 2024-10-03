const axios = require('axios');
const DB = require('./couchdb');

const captureRazorpayPayment = async (paymentId, channelId, payload, paymentLinkId) => {
    console.log("IN")

    console.log("paymentcapturepayload", payload, paymentId, channelId)

    var res;

    if (channelId === 1 || channelId === '1') {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.RAZOR_API_BASE_URL}/v1/payments/${paymentId}/capture`,
            auth: {
                username: process.env.LAWSIKHO_RAZORPAY_ID_KEY,
                password: process.env.LAWSIKHO_RAZORPAY_SECRET_KEY
            },
            data: payload
        };

        await axios.request(config)
            .then(async (response) => {
                console.log(response, "captureResponse");
                const logPayload = { response: response }
                logPayload.timestamp = new Date()
                logPayload.collectionName = 'Log'
                logPayload.paymentGatewayName = 'razorpay'
                logPayload.paymentLinkId = paymentLinkId
                logPayload.tag = 'capture_payment'
                const logResponse = await DB.insert(logPayload);

                console.log("logPayload: ", logPayload)
                console.log("logResponse: ", logPayload)


                // Check the response and send appropriate status and message
                if (logResponse.hasOwnProperty("ok")) {
                    console.log("Log created sucessfully")
                } else {
                    console.log("Log not created")
                }
                res = response?.data
            })
            .catch(async (error) => {
                console.log("captureResponse error", error?.response?.data);

                const logPayload = { response: error?.response?.data }
                logPayload.timestamp = new Date()
                logPayload.collectionName = 'Log'
                logPayload.paymentGatewayName = 'razorpay'
                logPayload.paymentLinkId = paymentLinkId
                logPayload.tag = 'capture_payment'
                const logResponse = await DB.insert(logPayload);

                // Check the response and send appropriate status and message
                if (logResponse.hasOwnProperty("ok")) {
                    console.log("Log created sucessfully")
                } else {
                    console.log("Log not created")
                }
            });
    }

    if (channelId === 2 || channelId === '2') {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.RAZOR_API_BASE_URL}/v1/payments/${paymentId}/capture`,
            auth: {
                username: process.env.SKILLARBITAGE_RAZORPAY_ID_KEY,
                password: process.env.SKILLARBITAGE_RAZORPAY_SECRET_KEY
            },
            data: payload
        };

        await axios.request(config)
            .then(async (response) => {
                console.log(response, "captureResponse");

                const logPayload = { response: response }
                logPayload.timestamp = new Date()
                logPayload.collectionName = 'Log'
                logPayload.paymentGatewayName = 'razorpay'
                logPayload.paymentLinkId = paymentLinkId
                logPayload.tag = 'capture_payment'
                const logResponse = await DB.insert(logPayload);

                // Check the response and send appropriate status and message
                if (logResponse.hasOwnProperty("ok")) {
                    console.log("Log created sucessfully")
                } else {
                    console.log("Log not created")
                }

                res = response?.data
            })
            .catch(async (error) => {
                console.log("captureResponse error", error?.response?.data);

                const logPayload = { response: error?.response?.data }
                logPayload.timestamp = new Date()
                logPayload.collectionName = 'Log'
                logPayload.paymentGatewayName = 'razorpay'
                logPayload.paymentLinkId = paymentLinkId
                logPayload.tag = 'capture_payment'
                const logResponse = await DB.insert(logPayload);

                // Check the response and send appropriate status and message
                if (logResponse.hasOwnProperty("ok")) {
                    console.log("Log created sucessfully")
                } else {
                    console.log("Log not created")
                }
            });
    }

    // Add a default return or throw an error if channelId is neither 1 nor 2
    // throw new Error('Invalid channelId');

    return res

}

module.exports = captureRazorpayPayment