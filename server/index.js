import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./Models/UserModel.js";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as ENV from "./config.js";

const app = express();
app.use(express.json());

// Middleware
const corsOptions = {
  origin: ENV.CLIENT_URL, // client URL from environment variable
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

// Database connection
const connectString =
  process.env.MONGO_URI ||
  `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=AdviseLinkCluster`;

mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

//create multer instance
const upload = multer({ storage: storage });

//convert the URL of the current module to a file path
const __filename = fileURLToPath(import.meta.url);

//get the directory name from the current file path
const __dirname = dirname(__filename);

//set up middleware to serve static files from the 'uploads' directory
//requests to '/uploads' will serve files from the local 'uploads' folder
app.use("/uploads", express.static(__dirname + "/uploads"));

//API Routes
//register User
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
      profilePic: req.body.profilePic,
    });

    await user.save();
    res.send({ user: user, msg: "Added." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const email = req.body.email;
    const password = req.body.password;
    console.log("Email from request:", email);
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

//logout api
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// Update Profile
app.put("/api/users/profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, updates } = req.body;

    // Find the user first
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If a new file was uploaded
    if (req.file) {
      // If user already has a profilePic, delete the old file
      if (user.profilePic) {
        const oldPicPath = path.join("uploads", user.profilePic);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
      // Set the new profilePic filename in updates
      updates.profilePic = req.file.filename;
    }

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found after update" });
    }

    res
      .status(200)
      .json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Profile by Email
app.put(
  "/updateUserProfile/:email",
  upload.single("profilePic"),
  async (req, res) => {
    const email = req.params.email;
    const { firstName, middleName, lastName, password } = req.body;

    try {
      // Find the user by email in the database
      const userToUpdate = await UserModel.findOne({ email: email });

      // If the user is not found, return a 404 error
      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if a file was uploaded and get the filename
      if (req.file) {
        const profilePic = req.file.filename;
        // Delete old profile picture if it exists
        if (userToUpdate.profilePic) {
          const oldFilePath = path.join("uploads", userToUpdate.profilePic);
          if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log("Old file deleted successfully");
              }
            });
          }
        }
        userToUpdate.profilePic = profilePic; // Set new profile picture filename
      }

      // Update user's name fields
      userToUpdate.firstName = firstName;
      userToUpdate.middleName = middleName;
      userToUpdate.lastName = lastName;

      // Hash the new password and update if it has changed
      if (password && password !== userToUpdate.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
      }

      // Save the updated user information to the database
      await userToUpdate.save();

      // Send the updated user data and a success message as a response
      res.send({ user: userToUpdate, msg: "Updated." });
    } catch (err) {
      // Handle any errors during the update process
      res.status(500).json({ error: err.message });
    }
  }
);

// app.listen(3001, () => {
//   console.log("Connected to server.");
// });

const PORT = ENV.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
