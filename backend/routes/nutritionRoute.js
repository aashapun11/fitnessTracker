const express = require("express");
const router = express.Router();
const nutritionController = require("../controllers/nutritionControllers");
const { protect } = require("../middleware/authMiddleware");
const { nutritionLimiter } = require("../middleware/rateLimit");

router.post("/addNutrition", protect, nutritionLimiter,  nutritionController.addNutrition);
router.get("/getNutrition", protect, nutritionController.getNutrition);
router.delete("/deleteNutrition/:id", protect, nutritionController.deleteNutrition);

// router.post("/updateWater",  nutritionController.updateWater);
// router.get("/getNutrition/:id", protect, nutritionController.getNutrition);

module.exports = router;