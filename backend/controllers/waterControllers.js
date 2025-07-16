const Water = require("../models/waterModel");

const waterController = {
  async updateWater(req, res) {
    const { date, waterGlasses} = req.body;

    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const updated = await Water.findOneAndUpdate(
    
        { date, user: userId },
        { date, waterGlasses, user: userId },
        { new: true, upsert: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getWater(req, res) {
    const { date } = req.query;

     const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const water = await Water.findOne({ date, user: userId });
      res.json(water || { waterGlasses: 0 });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = waterController;
