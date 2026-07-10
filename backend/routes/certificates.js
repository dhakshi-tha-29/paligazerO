const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const certificate = await Certificate.create({ ...req.body, user_id: req.body.user_id || req.user.id });
    res.status(201).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/verify/:code', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ verification_code: req.params.code });
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
