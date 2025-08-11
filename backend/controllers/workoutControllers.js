const Fitness = require("../models/fitnessmodel");
const User = require("../models/userModel");
const moment = require("moment");

const fitnessController = {

    async addWorkout(req, res){
        const { date,exercise_type, activity,  duration, sets, reps, equipmentWeight, calories } = req.body;
        

        if(exercise_type === "Cardio"){
            if (!date || !activity || !duration) {
                return res.status(400).json("Please fill in all fields.");
            }
        }
        else if(exercise_type === "Strength"){
            if (!date || !activity || !sets || !reps) {
                return res.status(400).json("Please fill in all fields.");
            }
        }
        else if(exercise_type === "WeightTraining"){
            if (!date || !activity ||  !sets || !reps || !equipmentWeight) {
                return res.status(400).json("Please fill in all fields.");
            }
        }
       
        const userId = req.user._id; // set by JWT middleware
        try{
           const fitness = new Fitness({ date, exercise_type, activity, duration, sets, reps, equipmentWeight, calories,
            user: userId, // ✅ associate with logged-in user
        });
             await fitness.save();


         // 2. Update streak

const user = await User.findById(userId);

const todayUTC = moment.utc().startOf("day");
  const workoutUTC = moment.utc(user.lastWorkoutDate).startOf("day");
  const selectedDateUTC = moment.utc(date).startOf("day");

  if(!selectedDateUTC.isSame(todayUTC) || !workoutUTC.isSame(todayUTC)) {
    res.json({ fitness, streak: user.streak });
    return;
  }

  
  if (!user.lastWorkoutDate) {
    // First ever workout
    user.streak = 1;
  } else {
    const lastWorkoutUTC = moment.utc(user.lastWorkoutDate).startOf("day");

    if (lastWorkoutUTC.isSame(todayUTC.clone().subtract(1, "day"))) {
      // Consecutive day → increase streak
      user.streak += 1;
    } else {
      // Missed a day → reset streak to 1
      user.streak = 1;
    }
  }

  // Update last workout date
  user.lastWorkoutDate = moment.utc().toDate();
  await user.save();

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

    /* I guess this is not required right now */


    ////*************** */ updating the single workout which is moreee seccure*/
  //  async updateWorkout(req, res){
  //       const id = req.params.id;
  //       const { date, activity, duration, calories } = req.body;
      
  //       if (!date || !activity || !duration || !calories) {
  //         return res.status(400).json("Please fill in all fields.");
  //       }
      
  //       try {
  //         const workout = await Fitness.findById(id);
         
      
  //         // Check if the workout exists
  //         if (!workout) {
  //           return res.status(404).json("Workout not found.");
  //         }
      
  //         // Check if the workout belongs to the logged-in user
  //         if (workout.user.toString() !== req.user._id.toString()) {
  //           return res.status(403).json("Access denied.");
  //         }
      
  //         // Update the workout
  //         workout.date = date;
  //         workout.activity = activity;
  //         workout.duration = duration;
  //         workout.calories = calories;
      
  //         const updatedWorkout = await workout.save();
  //         res.json(updatedWorkout);
  //       } catch (err) {
  //         res.status(400).json("Error: " + err.message);
  //       }
  //     },
      


    getWorkout(req,res){
        const { date } = req.query;
        const userId = req.user._id;

        Fitness.find({date, user: userId})
        .then((fitness) => res.json(fitness))
        .catch((err) => res.status(400).json("Error: " + err));
    }
}

module.exports = fitnessController