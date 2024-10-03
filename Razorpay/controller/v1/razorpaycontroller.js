const Razorpay = require('razorpay'); 
const DB = require('../../../common/couchdb');
const { LAWSIKHO_RAZORPAY_ID_KEY, LAWSIKHO_RAZORPAY_SECRET_KEY, SKILLARBITAGE_RAZORPAY_ID_KEY,SKILLARBITAGE_RAZORPAY_SECRET_KEY} = process.env;
const Joi = require('joi');

const razorpayInstance1 = new Razorpay({
    key_id: LAWSIKHO_RAZORPAY_ID_KEY,
    key_secret: LAWSIKHO_RAZORPAY_SECRET_KEY
});

const razorpayskillarbitageInstance = new Razorpay({
    key_id: SKILLARBITAGE_RAZORPAY_ID_KEY,
    key_secret: SKILLARBITAGE_RAZORPAY_SECRET_KEY
});



// const createOrder = async(req,res)=>{
//     try {
//         const amount = req.body.amount*100
//         const options = {
//             amount: amount,
//             currency: 'INR',
//             receipt: 'swatimonalisa.p@lawsikho.in',
//             notes: {
                
//               },
//             channelId

//         }

//         razorpayInstance.orders.create(options, 
//             (err, order)=>{
//                 if(!err){
//                     res.status(200).send({
//                         success:true,
//                         msg:'Order Created',
//                         order_id:order.id,
//                         amount:amount,
//                         key_id:RAZORPAY_ID_KEY,
//                         product_name:req.body.name,
//                         description:req.body.description,
//                         contact:req.body.contact,
//                         name: req.body.name,
//                         email: req.body.email,
//                         notes: req.body.notes,
//                         channelId: req.body.channelId
//                     });
//                 }
//                 else{
//                     res.status(400).send({success:false,msg:'Something went wrong!'});
//                 }
//             }
//         );

//     } catch (error) {
//         console.log(error.message);
//     }
// }

const createOrder = async (req, res) => {

    // Define Joi schema for email validation
    const emailSchema = Joi.string().email().required();

    // Validate the email
    const validationResult = emailSchema.validate(req.body.email);

    if (validationResult.error) {
        console.error("Invalid email:", validationResult.error.message);
        return res.status(400).send({ success: false, msg: 'Please provide a valid email' });
    }
    try {
        const amount = req.body.amount * 100;
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: req.body.email,
            notes: {
                "channelId": req.body.channelId,
                "paymentLinkId": req.body.notes[0],
                "name":req.body.name,
                "email":req.body.email,
                "phone":req.body.phone
            },
        };

        let razorpayInstance;
        let razorpayIdKey;

        if (req.body.channelId == 1) {
            razorpayInstance = razorpayInstance1; // Replace with your actual Razorpay instance for channelId 1
            razorpayIdKey = LAWSIKHO_RAZORPAY_ID_KEY; // Replace with your actual key for channelId 1
        } else if (req.body.channelId == 2) {
            razorpayInstance = razorpayskillarbitageInstance; // Replace with your actual Razorpay instance for channelId 2
            razorpayIdKey = SKILLARBITAGE_RAZORPAY_ID_KEY; // Replace with your actual key for channelId 2
        } else {
            // Handle other channelIds or set default values
            razorpayInstance = defaultRazorpayInstance; // Replace with your actual default Razorpay instance
            razorpayIdKey = DEFAULT_RAZORPAY_ID_KEY; // Replace with your actual default key
        }

        // Remove channelId from options before making the API request
        delete options.channelId;

        razorpayInstance.orders.create(options, async (err, order) => {
            if (!err) {

                const logPayload = { response: order }
                logPayload.timestamp = new Date()
                logPayload.collectionName = 'Log'
                logPayload.paymentGatewayName = 'razorpay'
                logPayload.paymentLinkId = req.body.notes.paymentLinkId
                logPayload.tag = 'order_create'
                const logResponse = await DB.insert(logPayload);

                // Check the response and send appropriate status and message
                if (logResponse.hasOwnProperty("ok")) {
                    console.log("Log created sucessfully")
                } else {
                    console.log("Log not created")
                }

                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: amount,
                    key_id: razorpayIdKey,
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: req.body.phone,
                    name: req.body.name,
                    email: req.body.email,
                    notes:order.notes,
                    channelId: req.body.channelId,
                    system:"Paymentsystem"
                });
            } else {
                console.error('Razorpay API error:', err);

                const logPayload = { response: err }
                logPayload.timestamp = new Date()
                logPayload.collectionName = 'Log'
                logPayload.paymentGatewayName = 'razorpay'
                logPayload.paymentLinkId = req.body.notes.paymentLinkId
                logPayload.tag = 'order_create'
                const logResponse = await DB.insert(logPayload);

                // Check the response and send appropriate status and message
                if (logResponse.hasOwnProperty("ok")) {
                    console.log("Log created sucessfully")
                } else {
                    console.log("Log not created")
                }
                res.status(400).send({ success: false, msg: 'Error creating order with Razorpay API' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).send({ success: false, msg: 'Error creating order' });
    }
};

module.exports = {
    createOrder
}