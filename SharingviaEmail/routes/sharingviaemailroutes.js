const router = require("express").Router();
const SharingviaemailfoController = require("../controller/v1/sharingviaemailcontroller");

router.post(
    "/Shareviaemail/:id",
    SharingviaemailfoController.Shareviaemail_share
);

router.post(
    "/generateandshare",
    SharingviaemailfoController.Generate_and_share
);



module.exports = router;