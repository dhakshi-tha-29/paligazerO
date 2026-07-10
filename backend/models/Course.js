const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: String,
  course_code: { type: String, unique: true },
  credits: { type: Number, default: 3 },
  duration_weeks: { type: Number, default: 12 },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  category: { type: String, default: 'General' },
  thumbnail: String,
  max_students: { type: Number, default: 50 },
  enrolled_count: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'upcoming', 'completed', 'archived'], default: 'active' },
  syllabus: [String],
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
