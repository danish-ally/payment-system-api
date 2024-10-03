const axios = require('axios');

const getDetailsByOrderIdCashFree = async (orderId, channelId) => {
    console.log("IN")

    var res;

    if (channelId === 1 || channelId === '1') {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.CASHFREE_API_BASE_URL}/orders/${orderId}`,
            headers: {
                'x-client-id': process.env.LAWSIKHO_CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.LAWSIKHO_CASHFREE_CLIENT_SECRET,
                'x-api-version': '2022-09-01'
            }
        };

        await axios.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));

                res = response.data
                // return response.data
            })
            .catch((error) => {
                console.log(error);
                return error
            });
    }

    if (channelId === 2 || channelId === '2') {
        console.log("hey")
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.CASHFREE_API_BASE_URL}/orders/${orderId}`,
            headers: {
                'x-client-id': process.env.SKILLARBITAGE_CASHFREE_CLIENT_ID,
                'x-client-secret': process.env.SKILLARBITAGE_CASHFREE_CLIENT_SECRET,
                'x-api-version': '2022-09-01'
            }
        };

        await axios.request(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));

                res = response.data
            })
            .catch((error) => {
                console.log(error.response.data);
                return error
            });
    }

    // Add a default return or throw an error if channelId is neither 1 nor 2
    // throw new Error('Invalid channelId');

    return res

}

module.exports = getDetailsByOrderIdCashFree