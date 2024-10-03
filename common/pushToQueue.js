const axios = require('axios');
const DB = require("../common/couchdb");

const pushToQueue = async (payload) => {

    console.log("MQ payload:", payload)
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.PUSH_TO_QUEUE_API}/api/pushToQueue?application=${process.env.MQ_APPLICATION_NAME}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    await axios.request(config)
        .then(async (response) => {
            console.log(JSON.stringify(response.data));
            if (response.status == 200) {
                if (payload[0].send_url == `${process.env.BASE_URL_GATEWAY}/api/payment/online/add`) {

                    // Retrieve existing document
                    let existingDoc;
                    try {
                        existingDoc = await DB.get(payload[0]?.payload?.data[0].payment_system_id);
                    } catch (error) {
                        if (error.statusCode === 404 && error.error === "not_found") {
                            res.status(404).json({
                                message: "PaymentLink not found",
                            });
                            return;
                        } else {
                            throw error; // rethrow other errors
                        }
                    }

                    existingDoc.isRevenueAddedSendToQueue = true
                    await DB.insert(existingDoc);
                }

                if (payload[0].send_url == `${process.env.BASE_URL_GATEWAY}/api/payment/online/update/${payload[0]?.payload?.data[0]?.id}`) {
                    // Retrieve existing document
                    let existingDoc;
                    try {
                        existingDoc = await DB.get(payload[0]?.payload?.data[0].id);
                    } catch (error) {
                        if (error.statusCode === 404 && error.error === "not_found") {
                            res.status(404).json({
                                message: "PaymentLink not found",
                            });
                            return;
                        } else {
                            throw error; // rethrow other errors
                        }
                    }

                    existingDoc.isRevenueUpdatedSendToQueue = true
                    await DB.insert(existingDoc);
                }
            }
            return response
        })
        .catch(async (error) => {
            console.log(error);
            if (error.response?.status != 200) {
                if (payload[0].send_url == `${process.env.BASE_URL_GATEWAY}/api/payment/online/add`) {

                    // Retrieve existing document
                    let existingDoc;
                    try {
                        existingDoc = await DB.get(payload[0]?.payload?.data[0].payment_system_id);
                    } catch (error) {
                        if (error.statusCode === 404 && error.error === "not_found") {
                            res.status(404).json({
                                message: "PaymentLink not found",
                            });
                            return;
                        } else {
                            throw error; // rethrow other errors
                        }
                    }

                    existingDoc.isRevenueAddedSendToQueue = false
                    await DB.insert(existingDoc);
                }

                if (payload[0].send_url == `${process.env.BASE_URL_GATEWAY}/api/payment/online/update/${payload[0]?.payload?.data[0]?.id}`) {
                    // Retrieve existing document
                    let existingDoc;
                    try {
                        existingDoc = await DB.get(payload[0]?.payload?.data[0].id);
                    } catch (error) {
                        if (error.statusCode === 404 && error.error === "not_found") {
                            res.status(404).json({
                                message: "PaymentLink not found",
                            });
                            return;
                        } else {
                            throw error; // rethrow other errors
                        }
                    }

                    existingDoc.isRevenueUpdatedSendToQueue = false
                    await DB.insert(existingDoc);
                }
            }
            return error
        });
}

module.exports = pushToQueue