const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const emailController = require('../controllers/emailController');


//Authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);


//Updating the profile
router.put('/updateProfile', protect, authController.updateProfile);

//Email verification
router.get('/verify-email', emailController.verifyEmail);
//Resend verification email
router.post('/resend-verification', emailController.resendVerificationEmail);

//Forgot password
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);



module.exports = router;
