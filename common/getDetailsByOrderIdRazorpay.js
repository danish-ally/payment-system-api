const axios = require('axios');

const getDetailsByOrderIdRazorpay = async (paymentId, channelId) => {
    console.log("IN")

    console

    var res;

    if (channelId === 1 || channelId === '1') {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.RAZOR_API_BASE_URL}/v1/payments/${paymentId}`,
            auth: {
                username: process.env.LAWSIKHO_RAZORPAY_ID_KEY,
                password: process.env.LAWSIKHO_RAZORPAY_SECRET_KEY
            }
        };

        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res = response.data
            })
            .catch((error) => {
                console.log(error.data);
            });
    }

    if (channelId === 2 || channelId === '2') {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.RAZOR_API_BASE_URL}/v1/payments/${paymentId}`,
            auth: {
                username: process.env.SKILLARBITAGE_RAZORPAY_ID_KEY,
                password: process.env.SKILLARBITAGE_RAZORPAY_SECRET_KEY
            }
        };

        await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res = response.data
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Add a default return or throw an error if channelId is neither 1 nor 2
    // throw new Error('Invalid channelId');

    return res

}

module.exports = getDetailsByOrderIdRazorpay