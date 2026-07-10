const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('-password');
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/dashboard', auth, authorize('faculty'), async (req, res) => {
  try {
    const assignments = await Assignment.find({ faculty_id: req.user.id });
    const assignmentIds = assignments.map(a => a._id);
    const submissions = await Submission.find({ assignment_id: { $in: assignmentIds } });
    res.json({
      success: true,
      stats: {
        total_assignments: assignments.length,
        total_submissions: submissions.length,
        graded_submissions: submissions.filter(s => s.status === 'graded').length,
        pending_review: submissions.filter(s => s.status === 'submitted').length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
