const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', default: null },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file_name: String,
  file_path: String,
  file_type: String,
  content: String,
  word_count: Number,
  status: { type: String, enum: ['submitted', 'grading', 'graded', 'returned'], default: 'submitted' },
  grade: Number,
  feedback: String,
  submitted_at: { type: Date, default: Date.now },
  graded_at: Date
}, { timestamps: false });

module.exports = mongoose.model('Submission', submissionSchema);
