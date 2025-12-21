import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  startTime: { type: Date, required: true },
  notes: { type: String, default: "" }, // Add this line
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
});

const MeetingModel = mongoose.model("Meeting", meetingSchema);
export default MeetingModel;
