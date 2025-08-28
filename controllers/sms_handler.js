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
      content: `Hello ${name}, your order (ID: #${appid}) has been successfully received on ${dateTime}. Thank you for choosing us!
`,
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

exports.createOwnerSms = async (req, res) => {
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
      content: `Hello Shop Owner, a new order (ID: #${appid}) from ${name} has been received on ${dateTime}. Please open your app to check the details!
`,
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
