import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  advisorId: 
  { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", required: true 
  },
  studentId: 
  {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users", default: null 
  }, // Null = Available
  startTime: 
  { 
    type: Date, 
    required: true 
  }, 
  location: {
    type: String,
    default: "Remote"
  },
  meetingType: 
  { 
    type: String, 
    default: "General" 
  }, // To be used in DropDown 
  isUrgent: 
  { 
    type: Boolean, 
    default: false 
  },  
  status: 
  { 
    type: String, 
    enum: ["scheduled", "completed", "cancelled"], 
    default: "scheduled" 
  }
});

export default mongoose.model("Meeting", meetingSchema);
