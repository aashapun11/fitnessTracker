const User = require("../models/userModel");
const {sendVerificationEmail} = require('../utils/sendEmail');
const crypto = require("crypto");
const emailController = {
    async verifyEmail(req, res) {
    const { token } = req.query;
  const user = await User.findOne({
    emailToken: token,
    tokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired." });
  }

  user.isVerified = true;
  user.emailToken = undefined;
  user.tokenExpiration = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully!" });
    },
    async resendVerificationEmail(req,res){
      const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.emailToken = token;
    user.tokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;

    await sendVerificationEmail({
      to: user.email,
      subject: "Resend Email Verification",
       html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://res.cloudinary.com/ddwrv4g2i/image/upload/v1749053491/ypx48aydobsrvovpn67n.png" alt="Fitness Tracker Logo" style="width: 100px; margin-bottom: 20px;" />
      <h2 style="color: #1E74BB; margin-bottom: 10px;">
        Welcome to <strong>Fitness Tracker 💪</strong>
      </h2>
    </div>

    <p style="font-size: 16px; color: #374151; line-height: 1.6;">
      Thanks for signing up! Please verify your email address by clicking the button below:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background-color: #1E74BB; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Verify Now
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280;">This verification link will expire in 1 hour.</p>
    <p style="font-size: 14px; color: #6b7280;">If you did not sign up for this account, feel free to ignore this email.</p>

    <hr style="margin: 30px 0; border-color: #e5e7eb;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      Fitness Tracker Team © ${new Date().getFullYear()}
    </p>
  </div>
`

    });

    res.status(200).json({ message: "Verification link resent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
    }
};

module.exports = emailController;