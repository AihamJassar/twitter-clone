const Notification = require("../models/notification.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const { v2: cloudinary } = require("cloudinary");

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id;
    const user = User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    if (img) {
      uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await Post.create(newPost);

    res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post Not Found" });

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await Notification.create(notification);
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: "Text field is required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post Not Found" });

    const comment = {
      user: userId,
      text,
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post Not Found" });

    if (post.user.toString() !== req.user._id.toString())
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });

    if (post.img)
      await cloudinary.uploader.destroy(img.split("/").pop().split(".")[0]);

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) return res.status(200).json([]);
    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLikedPosts = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
