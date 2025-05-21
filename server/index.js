import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/PostModel.js";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

// Middleware
app.use(cors());
// const corsOptions = {
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
// };

// app.use(cors(corsOptions));

// Database connection
const connectString =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin12345@adviselinkcluster.at1hxvj.mongodb.net/AdviseLink_application?retryWrites=true&w=majority&appName=AdviseLinkCluster";

mongoose.connect(connectString, {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

// API Routes
// Register User
app.post("/registerUser", async (req, res) => {
  try {
    const name = req.body.firstName;
    const middleName = req.body.middleName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const password = req.body.password;

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name: name,

      email: email,

      password: hashedpassword,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(3001, () => {
  console.log("Connected to server.");
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
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully" });
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
      tags: tags || [],
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
      message: userLikedIndex !== -1 ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
