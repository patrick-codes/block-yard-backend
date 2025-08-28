const express = require("express");
const router = express.Router();
const { createSms } = require("../controllers/sms_handler");
const { createOwnerSms } = require("../controllers/sms_handler");

// send sms
router.post("/send", createSms);
router.post("/send/owner", createOwnerSms);

module.exports = router;
