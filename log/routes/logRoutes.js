const router = require("express").Router();
const logController = require("../controller/v1/logController");

router.get(
    "/",
    logController.getAllLog
);
module.exports = router;
