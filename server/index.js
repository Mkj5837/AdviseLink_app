//Library
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

//Models or files
import UserModel from "./Models/UserModel.js";
import * as ENV from "./config.js";
import MeetingModel from "./Models/MeetingModel.js";
import TaskModel from "./Models/TaskModel.js";

const app = express();
app.use(express.json());

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || ENV.CLIENT_URL || "http://localhost:3000",
  methods: "GET,PUT,POST,DELETE,OPTIONS",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Database connection (prefers environment variable)
const connectString =
  process.env.MONGO_URI ||
  `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASSWORD}@${ENV.DB_CLUSTER}/${ENV.DB_NAME}?retryWrites=true&w=majority&appName=AdviseLinkCluster`;

mongoose
  .connect(connectString)
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
  const { email, firstName, middleName, lastName, profilePicUrl } = req.body;
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
    if (middleName !== undefined) updateFields.middleName = middleName;

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

// ------------------------------- Task Management APIs --------------------
app.post("/tasks", async (req, res) => {
  try {
    const { studentId, title, weight, deadline } = req.body;

    //Calculate days remaining until deadline
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffInDates = targetDate - today;
    const daysRemaining = Math.ceil(diffInDates / (1000 * 60 * 60 * 24));

    const newTask = new TaskModel({
      studentId,
      title,
      weight,
      deadline,
      daysRemaining: daysRemaining < 0 ? 0 : daysRemaining, // Logic: don't show negative days
      isCompleted: false
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task." });
  }
});

app.post("/scheduleMeeting", async (req, res) => {
  try {
    const { advisorId, studentId, startTime, locationData } = req.body;

    const newMeeting = new MeetingModel({
      advisorId,
      studentId,
      startTime,
      // Storing coordinates meets the "Location-based feature" requirement [cite: 51]
      location: locationData || "Remote",
      status: "scheduled"
    });

    await newMeeting.save();
    console.log("Meeting scheduled successfully:", newMeeting);
    res.status(201).json(newMeeting);
  } catch (error) {
    console.log("Error scheduling meeting:", error); 
    res.status(500).json({ error: "Failed to schedule meeting." });
  }
});

// GET meetings by student or advisor
app.get("/meetings", async (req, res) => {
  try {
    const { studentId, advisorId, status } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (advisorId) filter.advisorId = advisorId;
    if (status) filter.status = status;

    if (!studentId && !advisorId) {
      return res
        .status(400)
        .json({ error: "studentId or advisorId is required." });
    }

    const meetings = await MeetingModel.find(filter).sort({ startTime: 1 });
    res.status(200).json(meetings);
  } catch (error) {
    console.log("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings." });
  }
});

//READ/VIEW TASKS (for student dashboard)
app.get("/tasks/:studentId", async (req, res) => {
  try {
    const tasks = await TaskModel.find({ studentId: req.params.studentId });
    console.log("Fetched tasks:", tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error fetching tasks:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Location-based check-in (captures coords for auditing)
app.post("/checkin", async (req, res) => {
  try {
    const { studentId, latitude, longitude, timestamp } = req.body;
    if (!studentId || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "studentId, latitude, and longitude are required." });
    }

    // This is a lightweight endpoint; in production you'd persist to a collection.
    console.log(
      `Check-in from ${studentId}: (${latitude}, ${longitude}) at ${
        timestamp || new Date().toISOString()
      }`
    );

    res.status(200).json({
      message: "Check-in recorded.",
      coords: { latitude, longitude },
      timestamp: timestamp || new Date().toISOString(),
    });
  } catch (error) {
    console.log("Error capturing check-in:", error);
    res.status(500).json({ error: "Failed to record check-in." });
  }
});

//UPDATE TASK: Mark as complete and calculate overall progress %
app.put("/updateTaskStatus/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted, studentId } = req.body;

    //update the specific task status
    await TaskModel.findByIdAndUpdate(taskId, { isCompleted });

    //find all tasks for this student to calculate percentage.
    const allTasks = await TaskModel.find({ studentId });
    const completedTasksList = allTasks.filter(t => t.isCompleted);

    const totalCount = allTasks.length;
    const completedCount = completedTasksList.length;

    // base calculation
    let progressPercentage = totalCount > 0 
      ? Math.round((completedCount / totalCount) * 100) 
      : 0;

    console.log(`Student ${studentId} progress updated to: ${progressPercentage}%`);

    //deadline Penalty (-1% per late task)
    let penaltyCount = 0;
    const now = new Date();

    completedTasksList.forEach(task => {
      // If the task was completed after the deadline date
      if (task.deadline && now > new Date(task.deadline)) {
        penaltyCount++;
      }
    });

    //apply the penalty
    progressPercentage = Math.max(0, progressPercentage - penaltyCount);

    console.log(`Progress for ${studentId}: ${progressPercentage}% (Penalties: ${penaltyCount})`);

    //send back the updated progress so React can show it immediately
    res.status(200).json({
      message: "Task updated and progress calculated.",
      currentProgress: progressPercentage,
      completedCount: completedCount,
      totalCount: totalCount,
      penalties: penaltyCount 
    });

  } catch (error) {
    console.log("Error updating task/calculating progress:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Connected to server on port ${PORT}.`);
});

// const PORT = ENV.PORT || 4000 || 3001 || 5000;
// app.listen(PORT, () => {
//   console.log(`You are connect. Server running on port ${PORT}`);
// });
