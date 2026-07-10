const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course_code: String,
  course_name: String,
  max_similarity_score: { type: Number, default: 20 },
  due_date: Date
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
