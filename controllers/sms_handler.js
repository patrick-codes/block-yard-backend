const smsHelper = require("../services/smsService");
// const { sendOrderNotification } = require("../services/notificationService");

exports.createSms = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const { appid, name, phone, dateTime } = req.body;

    if (!appid || !name || !phone || !dateTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let phoneN = phone;
    if (phoneN.startsWith("0")) {
      phoneN = "233" + phoneN.slice(1);
    }

    await smsHelper({
      to: phoneN,
      content: `Hello ${name}, your order with ID: #${appid} has been submitted successfully on ${dateTime}.`,
    });

    res.status(201).json({
      message: "SMS Delivered Successfully!!",
      to: phoneN,
      appid,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
