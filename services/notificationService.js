const nodemailer = require("nodemailer");
const twilio = require("twilio");
const User = require("../models/user");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // You can use SMTP for SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderNotification = async (order, status) => {
  const customer = await User.findById(order.customer);

  if (!customer) return;

  const message = `Hello ${customer.name}, your order #${order._id} status has been updated to: ${status}.`;

  // Send Email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customer.email,
    subject: `Order Status Updated - ${status}`,
    text: message,
  });
};

// Export function in CommonJS style
module.exports = { sendOrderNotification };
