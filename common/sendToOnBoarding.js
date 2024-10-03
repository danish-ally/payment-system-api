const axios = require('axios');

const sendToOnBoarding = async (payload) => {

    

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.ONBOARDING_URL}/api/onboard/creation`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = sendToOnBoarding