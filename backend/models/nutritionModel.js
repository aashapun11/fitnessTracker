
const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  food: String,
  mealType: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  sugar: Number,
  fiber: Number,
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
   date: {
    type: String, // using YYYY-MM-DD format
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Nutrition = mongoose.model("Nutrition", nutritionSchema);
module.exports = Nutrition;