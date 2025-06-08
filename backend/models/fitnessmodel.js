const mongoose = require('mongoose');

const fitnessSchema = new mongoose.Schema({
   date : {
       type : Date,
       required : true
   },
   activity : {
       type : String,
       enum : ['Running','Cycling', 'Walking', 'Pushups', 'MountainClimb', 'Burpees'],
       required : true
   },
  duration : {
      type : Number,
      min : [0, 'Duration cannot be negative'],
      required : true
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
    