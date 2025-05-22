import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
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
  "mongodb+srv://admin:admin12345@adviselinkcluster.bnfupja.mongodb.net/AdviseLinkDB?retryWrites=true&w=majority&appName=AdviseLinkCluster";

mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API Routes
// Register User
app.post("/registerUser", async (req, res) => {
  try {
    const idNumber = req.body.idNumber;
    const fname = req.body.firstName;
    const Lname = req.body.lastName;
    //const gender = req.body.gender;
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;
    const age = req.body.age;
    const avatar = req.body.avatar;
    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      idNumber: idNumber,
      firstName: fname,
      lastName: Lname,
      email: email,
      password: hashedpassword,
      userType: userType,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { email, password } = req.body;
    console.log("Email from request:", email);
    console.log("Password from request:", password);
    //search the user
    const user = await UserModel.findOne({ email }).select("+password");
    //if not found
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    console.log(`User with email ${user.email} attempted to log in.`);
    console.log("Password from request:", password);
    console.log("Password from DB:", user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    //if everything is ok, send the user and message.
    res.status(200).json({ user, message: "Login Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.listen(3001, () => {
//   console.log("Connected to server.");
// });

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

const PORT = process.env.PORT || 4000; // use 4000 or any free port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
