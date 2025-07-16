
const Nutrition = require("../models/nutritionModel");

const nutritionController = {

    async addNutrition(req, res) {
        const { food, mealType, calories, protein, carbs, fat, sugar, fiber, water, date } = req.body;

        try {
            const nutrition = await Nutrition.create({
                  food,
                  mealType, 
                  calories, 
                  protein, 
                  carbs, 
                  fat, 
                  sugar, 
                  fiber, 
                  date,
                  user: req.user._id

             }); 
            res.status(201).json(nutrition);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getNutrition(req, res) {
        // try {
        //     const nutrition = await Nutrition.find({ user: req.user._id });
        //     res.json(nutrition);
        // } catch (error) {
        //     res.status(500).json({ error: error.message });
        // }

        if (!req.user || !req.user._id) {
  return res.status(401).json({ message: "User not authenticated" });
}

        const { date } = req.query;
        const userId = req.user._id;

  if (!date) return res.status(400).json({ error: "Date is required" });

  try {
    const meals = await Nutrition.find({
      date, // exact match like "2025-07-15"
      user: userId,
    });

    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
    },
}
module.exports = nutritionController;