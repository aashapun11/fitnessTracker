const Fitness = require("../models/fitnessmodel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
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

const today = moment().format("YYYY-MM-DD");

if (!user.lastWorkoutDate) {
  // First ever workout
  user.streak = 1;
} else {
  const diff = moment(today).diff(
    moment(user.lastWorkoutDate),
    "days"
  );

  if (diff === 1) {
    // Consecutive day
    user.streak += 1;
  } else if (diff > 1) {
    // Missed one or more days
    user.streak = 1;
  }
  // diff === 0 → same day, streak unchanged
}

// Update last workout day
user.lastWorkoutDate = today;
user.longestStreak = Math.max(user.streak, user.longestStreak);

await user.save();


  if ([7, 15, 30].includes(user.streak)) {
  await Notification.create({
    userId: user._id,
    type: "streak",
    title: `🔥 ${user.streak}-Day Streak!`,
    message: `Amazing! You've hit a ${user.streak}-day streak. Keep it going!`,
  });
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

    

    getWorkout(req,res){
        const { date } = req.query;
        const userId = req.user._id;

        Fitness.find({date, user: userId})
        .then((fitness) => res.json(fitness))
        .catch((err) => res.status(400).json("Error: " + err));
    }
}

module.exports = fitnessController