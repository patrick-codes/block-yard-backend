// sendSmsHelper.js
const axios = require("axios");

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

const authHeader =
  "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

async function sendSmsHelper({ to, from = "", content }) {
  const url = process.env.SMS_API_URL;

  const body = {
    to,
    from: "Marketa",
    content,
    clientId,
    clientSecret,
  };

  const response = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
  });

  return response.data;
}

module.exports = sendSmsHelper;
