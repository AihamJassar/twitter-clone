const express = require("express");
const router = express.Router();
const {
  getMe,
  signup,
  login,
  logout,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middlewares/protectRoute");

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
