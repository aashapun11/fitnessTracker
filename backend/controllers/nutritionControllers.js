
const Nutrition = require("../models/nutritionModel");

const nutritionController = {

    async addNutrition(req, res) {
        const { food, mealType, calories, protein, carbs, fat, sugar, fiber, date } = req.body;

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

   async  deleteNutrition(req, res) {
  const { id } = req.params;

  try {
    const item = await Nutrition.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Nutrition item not found" });
    }

    if (!item.user.equals(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
}
}
module.exports = nutritionController;