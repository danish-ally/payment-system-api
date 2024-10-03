const router = require("express").Router();
const cashfreeController = require("../controller/v1/cashfreecontroller");



router.post(
    "/InitiatePayment",
    cashfreeController.initiatePayment
);

router.get(
    "/status/:orderid", 
    cashfreeController.checkStatus
);

module.exports = router;
