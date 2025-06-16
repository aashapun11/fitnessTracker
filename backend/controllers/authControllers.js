const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const {sendVerificationEmail} = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const authController = {

    async signup(req, res) {
        try {
             const { name, username, email, password } = req.body;
             

            const token = crypto.randomBytes(32).toString("hex");



            
            const user = new User({name, username, email, password,
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
              // After verifying password
if (user.resetPasswordToken || user.resetPasswordExpires) {
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save(); // Save only if there's something to clear
}
             const baseUserData = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      streak: user.streak,
      isProfileComplete: user.isProfileComplete,
    };

    // If profile is complete, include additional fields
    if (user.isProfileComplete) {
      baseUserData.age = user.age;
      baseUserData.height = user.height;
      baseUserData.weight = user.weight;
      baseUserData.sex = user.sex;
    }

    res.status(200).json(baseUserData);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async completeProfile(req, res) {
    const { age, height, weight, sex } = req.body;

  try {
    // req.user comes from auth middleware (verified JWT)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update profile fields
    user.age = age;
    user.height = height;
    user.weight = weight;
    user.sex = sex;
    user.isProfileComplete = true;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      age: updatedUser.age,
      height: updatedUser.height,
      weight: updatedUser.weight,
      sex: updatedUser.sex,
      token: generateToken(updatedUser._id),
      isProfileComplete: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while completing profile." });
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
    },
    async forgotPassword(req, res) {
        try {
          const { email } = req.body;
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email First" });
    }
          const token = crypto.randomBytes(32).toString("hex");
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 600000; // 10 mins
          await user.save();
         const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendVerificationEmail({
      to: user.email,
      subject: "Reset Your Password",
       html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://res.cloudinary.com/ddwrv4g2i/image/upload/v1749053491/ypx48aydobsrvovpn67n.png" alt="Fitness Tracker Logo" style="width: 100px; margin-bottom: 20px;" />
      <h1 style="color: #1E74BB; margin-bottom: 10px;">
        Reset Your Password
      </h1>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background-color: #1E74BB; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280;">This Password Reset link will expire in 10 minutes.</p>
    <p style="font-size: 14px; color: #6b7280;">If you did not sign up for this account, feel free to ignore this email.</p>

    <hr style="margin: 30px 0; border-color: #e5e7eb;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      Fitness Tracker Team © ${new Date().getFullYear()}
    </p>
  </div>
`
    });

    res.status(200).json({ message: "Reset link sent to your email" });
    // res.status(200).json({ 
    //   token
    //  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
},
 async resetPassword(req, res) {

  const { token } = req.query;
  const {newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
 }
}

module.exports = authController