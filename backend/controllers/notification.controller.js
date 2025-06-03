const Notification = require("../models/notification.model");
const User = require("../models/user.model");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
