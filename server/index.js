//Library
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";

//Models or files
import UserModel from "./Models/UserModel.js";
import * as ENV from "./config.js";

const app = express();
app.use(express.json());

// Middleware
// const corsOptions = {
//   origin: ENV.CLIENT_URL, // client URL from environment variable
//   methods: "GET,PUT,POST,DELETE",
//   credentials: true, // Enable credentials (cookies, authorization headers, etc.)
// };

app.use(cors());

// // Database connection
// const connectString =
//   process.env.MONGO_URI ||
//   `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=AdviseLinkCluster`;
const connectString =
  "mongodb+srv://admin:admin12345@adviselinkcluster.bnfupja.mongodb.net/AdviseLinkDB?appName=AdviseLinkCluster";

mongoose
  .connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//------------------------------ API Routes --------------------
//register User (sign-up)
app.post("/registerUser", async (req, res) => {
  try {
    //check the values first (for better validation/security)
    const {
      idNumber,
      firstName,
      middleName,
      lastName,
      email,
      password,
      userType,
    } = req.body;

    if (
      !idNumber ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !userType
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    //check if the user exists in the app already.
    const existingUser = await UserModel.findOne({
      $or: [{ idNumber }, { email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this ID or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      idNumber: idNumber,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      email: email,
      password: hashedPassword,
      userType: userType,
    });
    await user.save();
    res.status(201).json({ user: user, msg: "User registered successfully." });
  } catch (error) {
    // Handle Mongoose Validation Errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "A user with this ID or email already exists." });
    }
    console.error("Registration Error:", error);
    res.status(500).json({
      error: "An internal server error occurred during registration.",
    });
  }
});

//login api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    //search the user
    const user = await UserModel.findOne({ email }).select("+password");
    //if not found
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log(`User with email ${user.email} attempted to log in.`);
    //if everything is ok, send the user and message.
    res.status(200).json({ user, message: "Login Success." });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

//logout api
app.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//Update api
app.put("/updateUser", async (req, res) => {
  const { email, firstName, lastName, profilePicUrl } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to identify the user." });
  }
  try {
    const updateFields = {};
    //set the update fields
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;

    //profil pic update
    if (profilePicUrl) {
      updateFields.profilePic = profilePicUrl;
    }

    //check if an update is requested
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    //find and update user
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    //if user not found
    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "User not found with the provided email." });
    }

    //success response
    res.status(200).json({
      user: updatedUser,
      message: "User profile updated successfully.",
    });
  } catch (error) {
    //handle DB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    console.error("User Update Error:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred during update." });
  }
});

//delete api
app.delete("/deleteUser", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required to delete the user." });
  }
  try {
    //find and delete user
    const deleteUser = await UserModel.findOneAndDelete({ email: email });

    //is user not found
    if (!deleteUser) {
      return res.status(404).json({
        error: "User not found with the provided email. Deletion failed.",
      });
    }
    //success response
    res.status(200).json({
      message: `User with email ${email} deleted successfully.`,
    });
  } catch (error) {
    console.error("User Delete Error:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred during deletion." });
  }
});

const PORT = 3001 || 4000 || 5000;
app.listen(PORT, () => {
  console.log("Connected to server.");
});

// const PORT = ENV.PORT || 4000 || 3001 || 5000;
// app.listen(PORT, () => {
//   console.log(`You are connect. Server running on port ${PORT}`);
// });
