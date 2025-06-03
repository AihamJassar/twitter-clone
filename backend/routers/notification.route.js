const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const { getNotifications, deleteNotifications } = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications)

module.exports = router;
