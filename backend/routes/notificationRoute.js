const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationControllers");
const { protect } = require("../middleware/authMiddleware");

router.get('/getNotifications', protect, notificationController.getNotifications);
router.patch('/markNotificationAsRead/:id', protect, notificationController.markNotificationAsRead);
router.put('/markAllAsRead', protect, notificationController.markAllAsRead);


//notification subscription
router.post('/subscribe', protect, notificationController.subscribe);



module.exports = router;