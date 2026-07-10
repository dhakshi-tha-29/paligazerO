const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

let resumes = {};

router.get('/', auth, async (req, res) => {
  try {
    res.json({ success: true, resume: resumes[req.user.id] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    resumes[req.user.id] = req.body;
    res.json({ success: true, resume: req.body });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
