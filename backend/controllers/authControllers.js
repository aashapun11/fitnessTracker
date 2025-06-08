const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const {sendVerificationEmail} = require('../utils/sendEmail');
const crypto = require('crypto');
require('dotenv').config();

const authController = {

    async signup(req, res) {
        try {
            // const { name, username, email, password, age, height, weight, sex } = req.body;
             const { username, email, password } = req.body;
             

            const token = crypto.randomBytes(32).toString("hex");



            // const user = new User({ name, username, email, password, age, height, weight, sex,
            //   emailToken: token,
            //   tokenExpiration: Date.now() + 3600000, // 1 hour
            //  });
            const user = new User({ username, email, password,
              emailToken: token,
              tokenExpiration: Date.now() + 3600000, // 1 hour
             });

            await user.save();
            const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
           

           await sendVerificationEmail({
            to : email,
            subject: "Verify Your Email",
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
        Verify Email
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
             res.status(201).json({ message: "Signup successful. Please verify your email." });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: "Invalid username or password" });
              }
              if (!user.isVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }
          
              const isMatch = await user.matchPassword(password);
          
              if (!isMatch) {
                return res.status(401).json({ message: "Invalid username or password" });
              }
              res.status(200).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                age: user.age,
                height: user.height,
                weight: user.weight,
                sex: user.sex,
                token: generateToken(user._id),
              });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async updateProfile(req,res){
        const userId = req.user._id; // from token
        const updatedData = req.body;
      
        try {
          const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
          });
          res.json(updatedUser);
        } catch (error) {
          res.status(400).json({ message: "Update failed" });
        }
    }
}

module.exports = authController