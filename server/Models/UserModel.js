import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  idNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 6,
    maxlength: 20,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  middleName: {
    type: String,
    required: false,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  age: {
    type: Number,
    required: false,
    min: 1,
    max: 120,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "null"],
    default: "null",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: false, // Not stored, only for validation on client
    select: false,
  },
  userType: {
    type: String,
    enum: ["student", "admin", "advisor"],
    default: "student",
  },
  profilePic: { type: String }, // <-- Add this line
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
