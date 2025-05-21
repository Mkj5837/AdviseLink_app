import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
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
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
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
  role: {
    type: String,
    enum: ["user", "admin", "advisor"],
    default: "user",
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  avatar: {
    type: String,
    default: "",
  },
  token: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
