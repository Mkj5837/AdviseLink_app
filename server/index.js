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
import AdviseeModel from "./Models/AdviseeModel.js";

const app = express();
app.use(express.json());

// Helpers for case-insensitive, exact string matching
const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const buildExactMatchRegex = (value = "") =>
  new RegExp(`^${escapeRegex(value)}$`, "i");
const buildIdOrEmailQuery = (identifier = "") => {
  const trimmed = identifier?.trim();
  if (!trimmed) return null;
  const clauses = [];
  const regex = buildExactMatchRegex(trimmed);
  clauses.push({ idNumber: regex }, { email: regex });

  // allow direct ObjectId lookups when a valid 24-char hex is provided
  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    clauses.push({ _id: new mongoose.Types.ObjectId(trimmed) });
  }
  return clauses;
};
const STUDENT_ROLE = { $regex: /^\s*student\s*$/i };
const ADVISOR_ROLE = { $regex: /^\s*advisor\s*$/i };

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || ENV.CLIENT_URL || "http://localhost:3000",
  methods: "GET,PUT,POST,DELETE,OPTIONS",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//Database connection
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

//delete user api
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

//------------------------------ Advisor-Student Relationship --------------------
//Search user by ID number (for advisor to find students)
app.get("/searchStudent/:idNumber", async (req, res) => {
  try {
    const idOrEmail = buildIdOrEmailQuery(req.params.idNumber);
    if (!idOrEmail)
      return res.status(400).json({ error: "Search term is required." });

    const student = await UserModel.findOne({
      $or: idOrEmail,
      userType: STUDENT_ROLE,
    }).select("idNumber firstName lastName email");

    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

//Add advisee to advisor's list in database
app.post("/addAdvisee", async (req, res) => {
  try {
    const { advisorIdNumber, studentIdNumber } = req.body;

    const advisorQuery = buildIdOrEmailQuery(advisorIdNumber);
    const studentQuery = buildIdOrEmailQuery(studentIdNumber);

    if (!advisorQuery || !studentQuery) {
      return res
        .status(400)
        .json({ error: "Advisor and student identifiers are required." });
    }

    const advisor = await UserModel.findOne({
      $or: advisorQuery,
      userType: ADVISOR_ROLE,
    });
    const student = await UserModel.findOne({
      $or: studentQuery,
      userType: STUDENT_ROLE,
    });

    if (!advisor || !student) {
      return res.status(404).json({ error: "Users not found." });
    }

    const newRelationship = new AdviseeModel({
      advisorId: advisor._id,
      studentId: student._id,
    });

    await newRelationship.save();

    await UserModel.updateOne(
      { _id: student._id },
      { $set: { advisorId: advisor._id } }
    );
    res.status(201).json({ message: "Advisee linked successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Student is already in your list." });
    }
    res.status(500).json({ error: "Database error." });
  }
});

//Fetch all advisees for a specific advisor
app.get("/myAdvisees/:advisorIdNumber", async (req, res) => {
  try {
    const advisorQuery = buildIdOrEmailQuery(req.params.advisorIdNumber);
    if (!advisorQuery)
      return res.status(400).json({ error: "Advisor id is required." });

    const advisor = await UserModel.findOne({
      $or: advisorQuery,
      userType: ADVISOR_ROLE,
    });
    if (!advisor) return res.status(404).json({ error: "Advisor not found" });

    // Find relationships and populate student details, keep added date
    const list = await AdviseeModel.find({ advisorId: advisor._id })
      .populate("studentId", "idNumber firstName lastName email userType")
      .lean();

    res
      .status(200)
      .json(
        list.map((item) => ({
          ...(item.studentId || {}),
          addedAt: item.addedAt,
        }))
      );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch advisees" });
  }
});

//Fetch advisor details for a specific student (reverse lookup)
app.get("/myAdvisor/:studentIdNumber", async (req, res) => {
  try {
    const rawIdentifier = req.params.studentIdNumber?.trim();
    const studentQuery = buildIdOrEmailQuery(rawIdentifier);
    if (!studentQuery)
      return res.status(400).json({ error: "Student id is required." });

    const idMatch = mongoose.Types.ObjectId.isValid(rawIdentifier)
      ? new mongoose.Types.ObjectId(rawIdentifier)
      : null;

    const directRelation = await AdviseeModel.findOne({
      $or: [
        ...(idMatch ? [{ studentId: idMatch }] : []),
        ...(idMatch ? [{ studentId: idMatch.toString() }] : []),
        { studentId: rawIdentifier },
      ],
    })
      .sort({ addedAt: -1 })
      .populate("advisorId", "idNumber firstName lastName email")
      .lean();

    if (directRelation?.advisorId) {
      return res.status(200).json(directRelation.advisorId);
    }

    const student = await UserModel.findOne({ $or: studentQuery });

    if (student?.advisorId) {
      const advisor = await UserModel.findById(student.advisorId).select(
        "idNumber firstName lastName email"
      );
      if (advisor) {
        return res.status(200).json(advisor);
      }
    }

    if (student) {
      const relation = await AdviseeModel.findOne({
        $or: [
          { studentId: student._id },
          { studentId: student._id?.toString?.() },
        ],
      })
        .sort({ addedAt: -1 })
        .populate("advisorId", "idNumber firstName lastName email")
        .lean();

      if (relation?.advisorId) {
        await UserModel.updateOne(
          { _id: student._id },
          { $set: { advisorId: relation.advisorId._id } }
        );
        return res.status(200).json(relation.advisorId);
      }

      const meeting = await MeetingModel.findOne({ studentId: student._id })
        .sort({ startTime: -1 })
        .populate("advisorId", "idNumber firstName lastName email")
        .lean();

      if (meeting?.advisorId) {
        await UserModel.updateOne(
          { _id: student._id },
          { $set: { advisorId: meeting.advisorId._id } }
        );
        return res.status(200).json(meeting.advisorId);
      }
    }

    const identifierRegex = buildExactMatchRegex(rawIdentifier);

    const adviseeMatches = await AdviseeModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $match: {
          $or: [
            { "student.idNumber": identifierRegex },
            { "student.email": identifierRegex },
            ...(idMatch ? [{ "student._id": idMatch }] : []),
          ],
        },
      },
      { $sort: { addedAt: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "advisorId",
          foreignField: "_id",
          as: "advisor",
        },
      },
      { $unwind: "$advisor" },
      {
        $project: {
          _id: "$advisor._id",
          idNumber: "$advisor.idNumber",
          firstName: "$advisor.firstName",
          lastName: "$advisor.lastName",
          email: "$advisor.email",
          studentId: "$student._id",
        },
      },
    ]);

    if (adviseeMatches.length) {
      const advisor = adviseeMatches[0];
      await UserModel.updateOne(
        { _id: advisor.studentId },
        { $set: { advisorId: advisor._id } }
      );
      const { studentId, ...advisorPayload } = advisor;
      return res.status(200).json(advisorPayload);
    }

    res.status(404).json({ error: "Advisor not assigned." });
  } catch (error) {
    console.error("Error fetching advisor:", error);
    res.status(500).json({ error: "Failed to fetch advisor." });
  }
});

//Get advisee progress for advisee list data
app.get("/adviseeProgress/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const idOrEmail = buildIdOrEmailQuery(studentId);
    if (!idOrEmail)
      return res.status(400).json({ error: "Student id is required." });

    const student = await UserModel.findOne({
      $or: idOrEmail,
      userType: STUDENT_ROLE,
    });
    if (!student) return res.status(404).json({ error: "Student not found" });

    //fetch all tasks of this student (support historical formats)
    const tasks = await TaskModel.find({
      $or: [
        { studentId: student._id }, // current ObjectId format
        { studentId: student._id?.toString?.() }, // stringified ObjectId
        { studentId: student.idNumber }, // legacy idNumber
        { studentId: student.email }, // fallback
      ],
    });

    if (tasks.length === 0) {
      return res.json({ progress: 0 });
    }

    //progress calculation logic
    const completedTasks = tasks.filter((t) => t.isCompleted);
    let progress = Math.round((completedTasks.length / tasks.length) * 100);

    //deadline penalties for missed work
    let penalties = 0;
    const now = new Date();
    completedTasks.forEach((task) => {
      if (task.deadline && now > new Date(task.deadline)) {
        penalties++;
      }
    });
    // progress maths
    progress = Math.max(0, progress - penalties);
    res.status(200).json({ progress });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

// Remove an advisee from the advisor's list
app.delete("/removeAdvisee", async (req, res) => {
  try {
    const { advisorIdNumber, studentIdNumber } = req.body;

    const advisorQuery = buildIdOrEmailQuery(advisorIdNumber);
    const studentQuery = buildIdOrEmailQuery(studentIdNumber);

    if (!advisorQuery || !studentQuery) {
      return res
        .status(400)
        .json({ error: "Advisor and student identifiers are required." });
    }

    // Find the actual database ObjectIds first
    const advisor = await UserModel.findOne({
      $or: advisorQuery,
      userType: ADVISOR_ROLE,
    });
    const student = await UserModel.findOne({
      $or: studentQuery,
      userType: STUDENT_ROLE,
    });

    if (!advisor || !student) {
      return res.status(404).json({ error: "Users not found." });
    }

    // Delete the relationship record from the advisees collection
    const deleted = await AdviseeModel.findOneAndDelete({
      advisorId: advisor._id,
      studentId: student._id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Relationship not found." });
    }

    await UserModel.updateOne(
      { _id: student._id, advisorId: advisor._id },
      { $set: { advisorId: null } }
    );

    res.status(200).json({ message: "Advisee removed successfully." });
  } catch (error) {
    console.error("Error removing advisee:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ------------------------------- Tasks APIs --------------------
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
      isCompleted: false,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task." });
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

//UPDATE TASK: Mark as complete and calculate overall progress %
app.put("/updateTaskStatus/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted, studentId } = req.body;

    //update the specific task status
    await TaskModel.findByIdAndUpdate(taskId, { isCompleted });

    //find all tasks for this student to calculate percentage.
    const allTasks = await TaskModel.find({ studentId });
    const completedTasksList = allTasks.filter((t) => t.isCompleted);

    const totalCount = allTasks.length;
    const completedCount = completedTasksList.length;

    //base calculation
    let progressPercentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    console.log(
      `Student ${studentId} progress updated to: ${progressPercentage}%`
    );

    //deadline Penalty (-1% per late task)
    let penaltyCount = 0;
    const now = new Date();

    completedTasksList.forEach((task) => {
      // If the task was completed after the deadline date
      if (task.deadline && now > new Date(task.deadline)) {
        penaltyCount++;
      }
    });

    //apply the penalty
    progressPercentage = Math.max(0, progressPercentage - penaltyCount);

    console.log(
      `Progress for ${studentId}: ${progressPercentage}% (Penalties: ${penaltyCount})`
    );

    //send back the updated progress so React can show it immediately
    res.status(200).json({
      message: "Task updated and progress calculated.",
      currentProgress: progressPercentage,
      completedCount: completedCount,
      totalCount: totalCount,
      penalties: penaltyCount,
    });
  } catch (error) {
    console.log("Error updating task/calculating progress:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// ------------------------------- Meeting APIs --------------------
//schedule a new meeting
app.post("/scheduleMeeting", async (req, res) => {
  try {
    const { advisorId, studentId, startTime, notes } = req.body;

    const advisor = await UserModel.findOne({ idNumber: advisorId });
    const student = await UserModel.findOne({
      $or: [{ idNumber: studentId }, { email: studentId }],
    });

    if (!advisor) return res.status(404).json({ error: "Advisor not found" });

    const newMeeting = new MeetingModel({
      advisorId: advisor._id,
      studentId: student ? student._id : null,
      startTime,
      notes,
      status: "scheduled",
    });

    await newMeeting.save();
    console.log("Meeting scheduled successfully:", newMeeting);
    res.status(201).json(newMeeting);
  } catch (error) {
    console.log("Error scheduling meeting:", error);
    res.status(500).json({ error: "Failed to schedule meeting." });
  }
});

// GET all registered advisors for the dropdown menu that will show in client side.
app.get("/advisors", async (req, res) => {
  try {
    const advisors = await UserModel.find({ userType: "advisor" }).select(
      "idNumber firstName lastName"
    ); //Only return necessary fields
    res.status(200).json(advisors);
  } catch (error) {
    console.error("Error fetching advisors:", error);
    res.status(500).json({ error: "Failed to fetch advisor list." });
  }
});

//GET meetings by student or advisor
app.get("/meetings", async (req, res) => {
  try {
    const { studentId, advisorId, status } = req.query;
    const filter = {};
    if (studentId) {
      if (mongoose.Types.ObjectId.isValid(studentId)) {
        filter.studentId = new mongoose.Types.ObjectId(studentId);
      } else {
        const student = await UserModel.findOne({
          $or: buildIdOrEmailQuery(studentId) || [],
          userType: STUDENT_ROLE,
        });
        if (student) {
          filter.studentId = student._id;
        } else {
          return res.status(404).json({ error: "Student not found." });
        }
      }
    }
    if (advisorId) {
      if (mongoose.Types.ObjectId.isValid(advisorId)) {
        filter.advisorId = new mongoose.Types.ObjectId(advisorId);
      } else {
        const advisor = await UserModel.findOne({
          $or: buildIdOrEmailQuery(advisorId) || [],
          userType: ADVISOR_ROLE,
        });
        if (advisor) {
          filter.advisorId = advisor._id;
        } else {
          return res.status(404).json({ error: "Advisor not found." });
        }
      }
    }
    if (status) filter.status = status;

    if (!studentId && !advisorId) {
      return res
        .status(400)
        .json({ error: "studentId or advisorId is required." });
    }

    const meetings = await MeetingModel.find(filter)
      .sort({ startTime: 1 })
      .populate("studentId", "firstName lastName idNumber email")
      .populate("advisorId", "firstName lastName idNumber email");
    res.status(200).json(meetings);
  } catch (error) {
    console.log("Error fetching meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings." });
  }
});

//---------------------------------- Location-based Features --------------------
//Location-based check-in (captures co-ords)
app.post("/checkin", async (req, res) => {
  try {
    const { studentId, latitude, longitude, timestamp } = req.body;
    if (!studentId || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .json({ error: "studentId, latitude, and longitude are required." });
    }

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected to server on port ${PORT}.`);
});
