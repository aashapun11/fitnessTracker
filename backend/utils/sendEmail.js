const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async ({to, subject, html}) => {

  await transporter.sendMail({
    from: `"Fitness Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html

  });
};

module.exports = { sendVerificationEmail };
