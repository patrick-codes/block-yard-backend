const express = require("express");
const router = express.Router();
const { createSms } = require("../controllers/sms_handler");

// send sms
router.post("/send", createSms);

module.exports = router;
