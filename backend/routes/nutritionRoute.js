const express = require("express");
const router = express.Router();
const nutritionController = require("../controllers/nutritionControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/addNutrition", protect,  nutritionController.addNutrition);
router.get("/getNutrition", protect, nutritionController.getNutrition);
// router.post("/updateWater",  nutritionController.updateWater);
// router.get("/getNutrition/:id", protect, nutritionController.getNutrition);
router.delete("/deleteNutrition/:id", protect, nutritionController.deleteNutrition);

module.exports = router;