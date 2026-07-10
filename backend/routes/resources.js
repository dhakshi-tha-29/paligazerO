const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const filter = req.query.domain ? { domain: req.query.domain } : {};
    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
