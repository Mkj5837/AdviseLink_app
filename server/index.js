import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/PostModel.js";
import * as ENV from "./config.js";

const app = express();

// Middleware
const corsOptions = {
  origin: ENV.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
const connectString = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=${ENV.DB_APP_NAME}`;

mongoose
  .connect(connectString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ user, msg: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({ user, message: "Login successful." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Update profile (stub for now)
app.put("/updateProfile", async (req, res) => {
  try {
    const { userId, updates } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res
      .status(200)
      .json({ user: updatedUser, msg: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Post
app.post("/savePost", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const post = new PostModel({
      content,
      userId,
      likes: { count: 0, users: [] },
    });
    await post.save();
    res.status(201).json({ post, msg: "Post created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Posts
app.get("/getPosts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    const count = await PostModel.countDocuments();
    res.status(200).json({ posts, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like / Unlike Post
app.put("/likePost/:postId", async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found." });

    const index = post.likes.users.indexOf(userId);

    if (index !== -1) {
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { "likes.count": -1 },
          $pull: { "likes.users": userId },
        },
        { new: true }
      );
      res.json({ post: updatedPost, msg: "Post unliked." });
    } else {
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { "likes.count": 1 },
          $addToSet: { "likes.users": userId },
        },
        { new: true }
      );
      res.json({ post: updatedPost, msg: "Post liked." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const port = ENV.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});
