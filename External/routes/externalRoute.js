const router = require("express").Router();
const paymentController = require("../controllers/v1/externalController");

router.get("/getcourse/:channelId", paymentController.getCourseByChannel);
router.get("/getpackage/:channelId", paymentController.getPackageByChannel);
router.get("/getbootcamp/:channelId", paymentController.getBootcampByChannel);
router.get("/getsalescaller/:channelId", paymentController.getSalesCallerList);
router.get("/getpaymenttype", paymentController.getPaymentType);
router.get("/getCoursePlan/:courseId/:channelId", paymentController.getCoursePlan);
router.get("/getPackagePlan/:packageId/:channelId", paymentController.getPackagePlan);
router.get("/getCoursePrice", paymentController.getCoursePrice);
router.post("/sendOrderDetails", paymentController.sendOrderDetails);
router.get("/countrycode", paymentController.getCountryCode);

module.exports = router;
