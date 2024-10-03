const router = require("express").Router();
const paymentLinkController = require("../controller/v1/PaymentLinkController");
const adminauth = require("../../middleware/adminauth");

router.post(
    "/generated-payment-link",
    paymentLinkController.generated_payment_link
);

router.patch(
    "/:id/cancel-payment-link",
    paymentLinkController.cancel_payment_link
);

router.get(
    "/:id",
    paymentLinkController.getPaymentLinkById
);

router.patch(
    "/:id/paid",
    paymentLinkController.change_status_to_paid
);

router.patch(
    "/:id/processing",
    paymentLinkController.change_status_to_processing
);

router.post(
    "/paid/webhook",
    paymentLinkController.change_status_to_paid_webhook
);

router.patch(
    "/:id/approval-status",
    paymentLinkController.approval_status
);

router.patch(
    "/:id/regenerate-payment-link",
    paymentLinkController.regenerate_payment_link
);


router.get(
    "/",adminauth,
    paymentLinkController.get_all_payment_link
);

router.get(
    "/report/list", adminauth,
    paymentLinkController.get_all_report_for_payment_link
);


router.get(
    "/generate/csv",
    paymentLinkController.csv_of_payment_link
);

router.patch(
    "/:id/share-payment-link",
    paymentLinkController.share_payment_link
);


router.get(
    "/:id/paymentversions",
    paymentLinkController.getPaymentLinkVersions
);

router.post(
    "/:id/send-to-revenueSystem",
    paymentLinkController.send_to_revenueSystem
);

router.patch(
    "/:id/edit-payment-link",
    paymentLinkController.edit_payment_link
);

router.post(
    "/:id/edit-approve-reject",
    paymentLinkController.approveRejectAprovalEdit
);

router.get(
    "/edit/pendinglist",
    paymentLinkController.getPendingEditPaymentList
);

router.get(
    "/edit/onlyeditlist",
    paymentLinkController.onlyEditPaymentList
);

// router.get(
//     "/redirect/:shortUrl",
//     paymentLinkController.redirect_payment_Url
// );

// router.post(
//     "/create-short-url",
//     paymentLinkController.create_Short_Url
// );

router.post("/revenue/add/:paymentLinkId", paymentLinkController.add_to_revenue)

module.exports = router;
