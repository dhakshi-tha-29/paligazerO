const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['enrolled', 'completed', 'dropped'], default: 'enrolled' },
  progress: { type: Number, default: 0 },
  enrolled_at: { type: Date, default: Date.now },
  completed_at: Date,
  grade: String,
}, { timestamps: true });

enrollmentSchema.index({ student_id: 1, course_id: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
