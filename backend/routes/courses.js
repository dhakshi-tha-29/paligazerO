const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { search, category, level, status } = req.query;
    const filter = {};
    if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }, { course_code: new RegExp(search, 'i') }];
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (status) filter.status = status;
    const courses = await Course.find(filter).populate('instructor', 'first_name last_name email').sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student_id: req.user.id, status: { $ne: 'dropped' } })
      .populate({ path: 'course_id', populate: { path: 'instructor', select: 'first_name last_name email' } })
      .sort({ enrolled_at: -1 });
    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/created', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'first_name last_name email department');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const enrollment = await Enrollment.findOne({ student_id: req.user.id, course_id: course._id });
    res.json({ success: true, course, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, instructor: req.user.id });
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    const existing = await Enrollment.findOne({ student_id: req.user.id, course_id: course._id });
    if (existing && existing.status !== 'dropped') return res.status(400).json({ success: false, message: 'Already enrolled' });
    if (course.enrolled_count >= course.max_students) return res.status(400).json({ success: false, message: 'Course is full' });
    if (existing && existing.status === 'dropped') {
      existing.status = 'enrolled';
      existing.progress = 0;
      existing.enrolled_at = Date.now();
      existing.completed_at = undefined;
      await existing.save();
      course.enrolled_count += 1;
      await course.save();
      return res.json({ success: true, enrollment: existing });
    }
    const enrollment = await Enrollment.create({ student_id: req.user.id, course_id: course._id });
    course.enrolled_count += 1;
    await course.save();
    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/unenroll', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ student_id: req.user.id, course_id: req.params.id });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    enrollment.status = 'dropped';
    await enrollment.save();
    await Course.findByIdAndUpdate(req.params.id, { $inc: { enrolled_count: -1 } });
    res.json({ success: true, message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course_id: req.params.id });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
