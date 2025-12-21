import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isCompleted: 
    { 
      type: Boolean, 
      default: false 
    },
    progressAtCompletion: 
    { 
      type: Number, 
      default: 0 
    },
    weight: {
      type: Number,
      required: true,
    }, // Requirement: Number
    deadline: {
      type: Date,
      required: true,
    },
    daysRemaining: {
      type: Number,
    }, // Calculation field.
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
