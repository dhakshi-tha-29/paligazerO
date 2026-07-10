const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const PlagiarismReport = require('../models/PlagiarismReport');
const { auth, authorize } = require('../middleware/auth');

router.get('/overview', auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'faculty';
    const filter = isAdmin ? {} : { student_id: req.user.id };

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSubmissions = await Submission.countDocuments(filter);
    const totalAssignments = await Assignment.countDocuments();
    const reportFilter = isAdmin ? {} : {};
    if (!isAdmin) {
      const subs = await Submission.find(filter).select('_id');
      reportFilter.submission_id = { $in: subs.map(s => s._id) };
    }
    const reports = await PlagiarismReport.find(reportFilter);
    res.json({
      success: true,
      overview: {
        total_students: totalStudents,
        total_submissions: totalSubmissions,
        total_assignments: totalAssignments,
        average_similarity: reports.length > 0 ? Math.round(reports.reduce((a, r) => a + (r.overall_similarity || 0), 0) / reports.length * 10) / 10 : 0,
        plagiarism_detected: reports.filter(r => (r.overall_similarity || 0) > 20).length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/plagiarism-trends', auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'faculty';
    let reportFilter = {};
    if (!isAdmin) {
      const subs = await Submission.find({ student_id: req.user.id }).select('_id');
      reportFilter.submission_id = { $in: subs.map(s => s._id) };
    }
    const reports = await PlagiarismReport.find(reportFilter).sort({ generated_at: 1 });
    const trends = reports.map(r => ({
      date: r.generated_at,
      similarity: r.overall_similarity,
      ai_score: r.ai_generated_score
    }));
    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/grade-distribution', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ status: 'graded' });
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    submissions.forEach(s => {
      if (s.grade >= 90) distribution.A++;
      else if (s.grade >= 80) distribution.B++;
      else if (s.grade >= 70) distribution.C++;
      else if (s.grade >= 60) distribution.D++;
      else distribution.F++;
    });
    res.json({ success: true, distribution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
