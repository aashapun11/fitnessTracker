const Fitness = require("../models/fitnessmodel");
const User = require("../models/userModel");
const moment = require("moment");

const fitnessController = {

    async addWorkout(req, res){
        const { date, activity, duration, calories } = req.body;
        if (!date || !activity || !duration || !calories) {
            return res.status(400).json("Please fill in all fields.");
        }
        const userId = req.user._id; // set by JWT middleware
        try{
           const fitness = new Fitness({ date, activity, duration, calories,
            user: userId, // ✅ associate with logged-in user
        });

        fitness.save();
         // 2. Update streak
      const user = await User.findById(userId);

      const today = moment(date).startOf("day");
      const lastWorkout = user.lastWorkoutDate
        ? moment(user.lastWorkoutDate).startOf("day")
        : null;

      if (!lastWorkout || !lastWorkout.isSame(today)) {
        if (lastWorkout && lastWorkout.isSame(today.clone().subtract(1, "day"))) {
          // Consecutive day => increase streak
          user.streak += 1;
        } else {
          // Not consecutive => reset streak
          user.streak = 1;
        }

        // Update lastWorkoutDate
        user.lastWorkoutDate = today.toDate();
        await user.save();
      }

      res.json({ fitness, streak: user.streak });

        }catch (err) {
      console.error(err);
      res.status(400).json("Error: " + err.message);
    }
    
    },
    getWorkouts(req, res){
        const userId = req.user._id; // from JWT

        Fitness.find({ user: userId })
        .then((fitness) => res.json(fitness))
        .catch((err) => res.status(400).json("Error: " + err));
    },

    //deleting all workouts
    deleteWorkouts(req, res){
        // const userId = req.user._id;
        Fitness.deleteMany()
        .then((fitness) => res.json(fitness))
        .catch((err) => res.status(400).json("Error: " + err));
    },
    //deleting single workout
    deleteWorkout(req, res){
        const id = req.params.id;
        Fitness.findByIdAndDelete(id)
        .then((fitness) => res.json(fitness))
        .catch((err) => res.status(400).json("Error: " + err));
    },

    ////*************** */ updating the single workout which is moreee seccure*/
   async updateWorkout(req, res){
        const id = req.params.id;
        const { date, activity, duration, calories } = req.body;
      
        if (!date || !activity || !duration || !calories) {
          return res.status(400).json("Please fill in all fields.");
        }
      
        try {
          const workout = await Fitness.findById(id);
         
      
          // Check if the workout exists
          if (!workout) {
            return res.status(404).json("Workout not found.");
          }
      
          // Check if the workout belongs to the logged-in user
          if (workout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json("Access denied.");
          }
      
          // Update the workout
          workout.date = date;
          workout.activity = activity;
          workout.duration = duration;
          workout.calories = calories;
      
          const updatedWorkout = await workout.save();
          res.json(updatedWorkout);
        } catch (err) {
          res.status(400).json("Error: " + err.message);
        }
      },
      
///////////////*************Lesssssssssss Secure while update */
// updateWorkout(req, res){
//     const id = req.params.id;
//     const { date, activity, duration, calories } = req.body;
//     if (!date || !activity || !duration || !calories) {
//         return res.status(400).json("Please fill in all fields.");
//     }
//     Fitness.findByIdAndUpdate(id, { date, activity, duration, calories })
//     .then((fitness) => res.json(fitness))
//     .catch((err) => res.status(400).json("Error: " + err));
// },

    getWorkout(req,res){
        const id = req.params.id;
        Fitness.findById(id)
        .then((fitness) => res.json(fitness))
        .catch((err) => res.status(400).json("Error: " + err));
    }
}

module.exports = fitnessController