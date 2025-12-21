import mongoose from "mongoose";

const adviseeSchema = new mongoose.Schema({
  advisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

//Ensure an advisor can't add the same student twice
adviseeSchema.index({ advisorId: 1, studentId: 1 }, { unique: true });

const AdviseeModel = mongoose.model("advisees", adviseeSchema);
export default AdviseeModel;
