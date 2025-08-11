const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
   date : {
       type : Date,
       required : true
   },
   exercise_type: {
    type: String,
    enum: ['Cardio', 'Strength', 'WeightTraining'],
    required: true
  },
   activity : {
       type : String,
       required : true
   },
  duration : {
      type : Number,
      min : [0, 'Duration cannot be negative'],
      default : null
  },
  sets : {
      type : Number,
      min : [0, 'Sets cannot be negative'],
      default : null
  },
  reps : {
      type : Number,
      min : [0, 'Reps cannot be negative'],
      default : null
  },
  equipmentWeight : {
      type : Number,
      min : [0, 'Weight cannot be negative'],
      default : null
  },
  distance : {
      type : Number,
      min : [0, 'Distance cannot be negative'],
      default : null
  },
  
  calories : {
      type : Number,
      min : [0, 'Calories cannot be negative'],
      required : true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});


const Fitness = mongoose.model('fitness', fitnessSchema);
module.exports = Fitness;
    