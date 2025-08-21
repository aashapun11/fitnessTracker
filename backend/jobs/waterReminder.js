// jobs/waterReminder.js
const cron = require("node-cron");
const User = require("../models/userModel.js");
const Water = require("../models/waterModel.js");
const webpush = require("../config/webpush.js");

function startWaterReminderJob() {
cron.schedule("0 10-19/3 * * *", async () => {
  const users = await User.find({ pushSubscription: { $ne: null } });
  if (users.length === 0) return;
  
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const dailyTargetWaterGlasses = 8;
for (const user of users) {
    const water = await Water.findOne({ date: today, user: user._id });
    if(water?.waterGlasses >= dailyTargetWaterGlasses) continue;
    try {
      await webpush.sendNotification(
        user.pushSubscription,
        JSON.stringify({
          title: "💧 Time to Drink Water!",
          message: "Stay hydrated. Your body will thank you!"
       })
      );
    } catch (err) {
      console.error("Push error:", err);
    }
  }
});
}

module.exports = startWaterReminderJob;