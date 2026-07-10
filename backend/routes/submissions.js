const express = require('express');
const router = express.Router();
const fs = require('fs');
const Submission = require('../models/Submission');
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');

router.post('/upload', auth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const submissions = [];
    for (const file of req.files) {
      let content = '';
      try {
        const ext = file.originalname.split('.').pop().toLowerCase();
        if (ext === 'txt') {
          content = fs.readFileSync(file.path, 'utf8');
        } else {
          content = `[File: ${file.originalname} — uploaded for plagiarism checking]`;
        }
      } catch (e) {
        content = '';
      }
      const sub = await Submission.create({
        assignment_id: req.body.assignment_id || null,
        student_id: req.user.id,
        file_name: file.originalname,
        file_path: file.path,
        file_type: file.mimetype,
        content: content,
        word_count: content.split(/\s+/).filter(Boolean).length
      });
      submissions.push(sub);
    }
    res.status(201).json({ success: true, submissions, submission_id: submissions[0]._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/text', auth, async (req, res) => {
  try {
    const { content, assignment_id } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const sub = await Submission.create({
      assignment_id: assignment_id || null,
      student_id: req.user.id,
      content: content.trim(),
      word_count: wordCount
    });
    res.status(201).json({ success: true, submission: sub, submission_id: sub._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student_id: req.user.id })
      .populate('assignment_id', 'title course_code')
      .sort({ submitted_at: -1 });
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
