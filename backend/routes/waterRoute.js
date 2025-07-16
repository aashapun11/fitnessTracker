const express = require("express");
const router = express.Router();
const waterController = require("../controllers/waterControllers");
const { protect } = require("../middleware/authMiddleware");

router.get("/getWater", protect, waterController.getWater);
router.post("/updateWater", protect, waterController.updateWater);

module.exports = router;
