const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutControllers');
const authController = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddleware');


router.post('/addWorkout',  protect, workoutController.addWorkout);
router.get('/getWorkouts', protect, workoutController.getWorkouts);
router.get('/getWorkout/:id', protect, workoutController.getWorkout);
router.delete('/deleteWorkouts', protect, workoutController.deleteWorkouts);
router.delete('/deleteWorkout/:id', protect, workoutController.deleteWorkout);
router.put('/updateWorkout/:id', protect, workoutController.updateWorkout);









module.exports = router;