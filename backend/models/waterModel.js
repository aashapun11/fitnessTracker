const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  waterGlasses: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // if you're using user authentication
    required: true 
  },
});

const Water = mongoose.model("Water", waterSchema);
module.exports = Water;
