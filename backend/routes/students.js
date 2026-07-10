const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const PlagiarismReport = require('../models/PlagiarismReport');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/dashboard', auth, authorize('student'), async (req, res) => {
  try {
    const submissions = await Submission.find({ student_id: req.user.id });
    const assignmentCount = await Assignment.countDocuments();
    const plagiarismReports = await PlagiarismReport.find({ submission_id: { $in: submissions.map(s => s._id) } });
    res.json({
      success: true,
      stats: {
        total_submissions: submissions.length,
        total_assignments: assignmentCount,
        average_similarity: plagiarismReports.length > 0 ? plagiarismReports.reduce((a, r) => a + (r.overall_similarity || 0), 0) / plagiarismReports.length : 0,
        graded_count: submissions.filter(s => s.status === 'graded').length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
