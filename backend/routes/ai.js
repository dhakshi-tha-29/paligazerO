const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { auth } = require('../middleware/auth');

const responses = {
  'plagiarism': 'Plagiarism detection uses exact matching, semantic analysis, and paraphrase detection to identify similarities with existing content.',
  'assignment': 'You can submit your assignment by going to the Assignments page, selecting an assignment, and uploading your file.',
  'grade': 'Grades are assigned by faculty after reviewing your submission and plagiarism report.',
  'citation': 'PaliGazer supports APA, MLA, and IEEE citation formats. Use the Citation Validator to check your references.',
  'certificate': 'Certificates are automatically generated when you complete workshops, projects, or courses.',
  'hello': 'Hello! I am the PaliGazer assistant. I can help you with plagiarism, assignments, grading, citations, and certificates.',
  'help': 'I can assist with: plagiarism detection, assignment submissions, grades, citations, and certificates. What do you need help with?'
};

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMsg = message.toLowerCase();
    let response = 'I can help with plagiarism detection, assignments, grades, citations, and certificates. Could you please be more specific?';
    for (const [key, val] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) { response = val; break; }
    }
    await ChatMessage.create({ user_id: req.user.id, message, response });
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/chat/history', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user_id: req.user.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/analyze', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;
    res.json({
      success: true,
      analysis: {
        word_count: wordCount,
        readability_score: Math.round(Math.random() * 40 + 60),
        ai_probability: Math.round(Math.random() * 30),
        suggestions: ['Consider adding more citations', 'Improve paragraph transitions', 'Use more specific examples']
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
