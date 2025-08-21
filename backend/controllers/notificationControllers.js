const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const notificationController = {
    async getNotifications(req, res) {
        try {
          const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(30);

          res.status(200).json(notifications);
        } catch (error) {
          res.status(500).json({ error: "Internal server error" });
        }
      },

      async markNotificationAsRead(req, res) {
        try {
  const  notificationId  = req.params.id;
  await Notification.findByIdAndUpdate(
    { _id: notificationId, userId: req.user._id},
    { isRead: true },
    { new: true }
  );

  res.status(200).json({ message: "Notification marked as read" });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
      },

      async markAllAsRead(req, res) {
        try {
          await Notification.updateMany({ userId: req.user._id, isRead: false },
             { $set: { isRead: true }});
          res.status(200).json({ message: "All notifications marked as read" });
        } catch (error) {
          res.status(500).json({ error: "Internal server error" });
        }
      },


      async subscribe(req, res) {
        try {
    const subscription = req.body; 
    const userId = req.user._id; 

    await User.findByIdAndUpdate(
      userId, 
      {
      pushSubscription: subscription,
      pushSubscribed: true}
    );

    res.json({ success: true, pushSubscribed: true });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ success: false, error: "Failed to subscribe" });
  }
      },


}

module.exports = notificationController