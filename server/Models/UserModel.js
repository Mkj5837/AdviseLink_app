import mongoose from "mongoose";

const UserSchema =new mongoose.Schema({
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
    minlength: 3,
    maxlength: 20,
  },
  middleName: {
    type: String,
    required: false,
    trim: true,
    maxlength: 25,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@sct\.edu\.om$/, "Email must end with @sct.edu.om"],
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
    required: true,
    enum: ["student", "admin", "advisor"],
    default: "student",
  },
  profilePic: { 
    type: String,
    default: "./pfpDefault.jpeg"
  },
}, {
  timestamps: true  // This enables automatic createdAt and updatedAt fields
});

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
