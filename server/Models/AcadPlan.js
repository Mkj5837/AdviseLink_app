const mongoose = require('mongoose');

const academicPlanSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  major: {
    type: String,
    required: true
  },
  courses: [{
    name: String,
    code: String,
    credits: Number,
    semester: String,
    year: Number,
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed'],
      default: 'planned'
    }
  }],
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AcademicPlan', academicPlanSchema);