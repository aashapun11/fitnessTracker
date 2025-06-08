const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutControllers');
const authController = require('../controllers/authControllers');
const emailController = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');


router.post('/addWorkout',  protect, workoutController.addWorkout);
router.get('/getWorkouts', protect, workoutController.getWorkouts);
router.get('/getWorkout/:id', protect, workoutController.getWorkout);
router.delete('/deleteWorkouts', protect, workoutController.deleteWorkouts);
router.delete('/deleteWorkout/:id', protect, workoutController.deleteWorkout);
router.put('/updateWorkout/:id', protect, workoutController.updateWorkout);

//Authentication
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//Updating the profile
router.put('/updateProfile', protect, authController.updateProfile);

//Email verification
router.get('/verify-email', emailController.verifyEmail);

//Resend verification email
router.post('/resend-verification', emailController.resendVerificationEmail);

module.exports = router;