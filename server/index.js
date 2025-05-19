const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const UserModel = require('./Models/UserModel');
const PostModel = require('./Models/PostModel');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Database connection
const connectString = process.env.MONGO_URI || 'mongodb://localhost:27017/adviselink';

mongoose.connect(connectString)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    
    const user = new UserModel({
      name,
      email,
      password, // Password will be hashed by the pre-save hook
      role: role || 'user'
    });

    await user.save();
    res.status(201).json({ user, message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ user, message: "Login successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
app.post("/api/auth/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Update Profile
app.put("/api/users/profile", async (req, res) => {
  try {
    const { userId, updates } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Post
app.post("/api/posts", async (req, res) => {
  try {
    const { title, content, category, userId, tags } = req.body;
    
    const post = new PostModel({
      title,
      content,
      category,
      userId,
      tags: tags || []
    });
    
    await post.save();
    res.status(201).json({ post, message: "Post created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    const count = await PostModel.countDocuments();
    res.status(200).json({ posts, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike Post
app.put("/api/posts/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    const userLikedIndex = post.likes.users.indexOf(userId);
    if (userLikedIndex !== -1) {
      // Unlike
      post.likes.count -= 1;
      post.likes.users.pull(userId);
    } else {
      // Like
      post.likes.count += 1;
      post.likes.users.push(userId);
    }
    
    await post.save();
    res.status(200).json({ 
      post, 
      message: userLikedIndex !== -1 ? "Post unliked" : "Post liked" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
