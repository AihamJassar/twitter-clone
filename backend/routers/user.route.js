const express = require("express");
const { protectRoute } = require("../middlewares/protectRoute");
const {
  getUserProfile,
  getSuggestedUsers,
  followUnfollowUser,
  updateUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

module.exports = router;
