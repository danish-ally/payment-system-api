const router = require("express").Router();
const razorpayController = require("../controller/v1/razorpaycontroller");



router.post(
    "/Createorder",
    razorpayController.createOrder
);

module.exports = router;
