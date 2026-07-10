const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const memberTeams = await TeamMember.find({ user_id: req.user.id });
    const teamIds = memberTeams.map(m => m.team_id);
    const teams = await Team.find({ $or: [{ created_by: req.user.id }, { _id: { $in: teamIds } }] });
    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const team = await Team.create({ ...req.body, created_by: req.user.id });
    await TeamMember.create({ team_id: team._id, user_id: req.user.id, role: 'leader' });
    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/members', auth, async (req, res) => {
  try {
    const member = await TeamMember.create({ team_id: req.params.id, user_id: req.body.user_id });
    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id/members', auth, async (req, res) => {
  try {
    const members = await TeamMember.find({ team_id: req.params.id }).populate('user_id', 'first_name last_name email');
    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ team_id: req.params.id }).populate('assigned_to', 'first_name last_name');
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/tasks', auth, async (req, res) => {
  try {
    const task = await Task.create({ team_id: req.params.id, ...req.body });
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
