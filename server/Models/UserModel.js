import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      match: [/^[^\s@]+@utas\.edu\.om$/, "Email must end with @utas.edu.om"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password must be at least 6 characters"],
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
      default: "",
    },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  }
);

const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
