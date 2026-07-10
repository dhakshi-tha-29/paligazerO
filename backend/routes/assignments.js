const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const PlagiarismReport = require('../models/PlagiarismReport');
const upload = require('../middleware/upload');
const { auth, authorize } = require('../middleware/auth');

router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });
    const filter = req.user.role === 'faculty' ? { faculty_id: req.user.id } : {};
    const regex = new RegExp(q, 'i');
    const assignments = await Assignment.find({
      ...filter,
      $or: [{ title: regex }, { description: regex }]
    }).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'faculty' ? { faculty_id: req.user.id } : {};
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, faculty_id: req.user.id });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/submit', auth, authorize('student'), upload.array('files', 10), async (req, res) => {
  try {
    const submissions = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const sub = await Submission.create({
          assignment_id: req.params.id,
          student_id: req.user.id,
          file_name: file.originalname,
          file_path: file.path,
          file_type: file.mimetype,
          content: req.body.content || ''
        });
        submissions.push(sub);
      }
    } else if (req.body.content) {
      const sub = await Submission.create({
        assignment_id: req.params.id,
        student_id: req.user.id,
        content: req.body.content
      });
      submissions.push(sub);
    } else {
      return res.status(400).json({ success: false, message: 'Provide files or content' });
    }

    res.status(201).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id/submissions', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment_id: req.params.id })
      .populate('student_id', 'first_name last_name email');

    const submissionsWithReports = await Promise.all(
      submissions.map(async (sub) => {
        const report = await PlagiarismReport.findOne({ submission_id: sub._id });
        return { ...sub.toObject(), plagiarism_report: report || null };
      })
    );

    res.json({ success: true, submissions: submissionsWithReports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
