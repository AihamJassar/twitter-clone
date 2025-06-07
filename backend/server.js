const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");

const authRoutes = require("./routers/auth.route");
const userRoutes = require("./routers/user.route");
const postRoutes = require("./routers/post.route");
const notificationRoutes = require("./routers/notification.route");

const { connectMongoDB } = require("./db/config");

const app = express();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("{*/splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, (_) => {
  console.log(`Server running on ${PORT}`);
  connectMongoDB();
});
