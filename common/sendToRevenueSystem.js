const axios = require('axios');
const sendToOnBoarding = require('./sendToOnBoarding');

const sendToRevenueSystem = async (payload, paymentType, existingDoc) => {

    console.log("existingDoc sendToReve", existingDoc)

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BASE_URL_GATEWAY}/api/create_order_from_lawsikho`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: payload
    };

    axios.request(config)
        .then(async (response) => {
            console.log(JSON.stringify(response.data));
            if (response?.data?.data[0]?.brand_registration_link) {

                console.log("sir")
                const onboardingPayload = {
                    "id": response.data?.data[0]?.brand_order_id,
                    "name": response.data?.data[0]?.payee_name,
                    "email": response.data?.data[0]?.payee_email,
                    "country_code": "91",
                    "phone": response.data?.data[0]?.payee_phone,
                    "course_type": existingDoc.courseType == 'standalone' ? 'course' : existingDoc.courseType == 'package' ? 'library' : 'offer',
                    "enrollmentId": response.data?.data[0]?.brand_course_id
                        ? response.data?.data[0].brand_course_id
                        : (response.data?.data[0].brand_bootcamp_id
                            ? response.data?.data[0].brand_bootcamp_id
                            : (response.data?.data[0].brand_package_id
                                ? response.data?.data[0].brand_package_id
                                : "")),
                    "payment_type": paymentType,
                    "brand_id": response.data?.data[0].brand_id, 
                    "brand_batch_id": response.data?.data[0].brand_batch_id,
                    "registration_link": response.data?.data[0].brand_registration_link,
                }

                console.log("onboardingPayload:", onboardingPayload)

                await sendToOnBoarding(onboardingPayload)
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

module.exports = sendToRevenueSystem