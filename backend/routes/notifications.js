const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/read', auth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user.id }, { is_read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
