const express = require('express');
const router = express.Router();
const PlagiarismReport = require('../models/PlagiarismReport');
const Submission = require('../models/Submission');
const { auth, authorize } = require('../middleware/auth');

function getWords(text) {
  return (text || '').split(/\s+/).filter(Boolean);
}

function getSentences(text) {
  return (text || '').split(/[.!?]+/).filter(s => s.trim().length > 0);
}

function getPhrases(words, n) {
  const phrases = [];
  for (let i = 0; i <= words.length - n; i++) {
    phrases.push(words.slice(i, i + n).join(' '));
  }
  return phrases;
}

function calculateAIHeuristics(content) {
  const words = getWords(content);
  const sentences = getSentences(content);
  if (words.length === 0 || sentences.length === 0) return 0;

  const lengths = words.map(w => w.length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((a, b) => a + (b - avgLen) ** 2, 0) / lengths.length;
  const cv = Math.sqrt(variance) / avgLen;

  const sentLens = sentences.map(s => getWords(s).length);
  const sentAvg = sentLens.reduce((a, b) => a + b, 0) / sentLens.length;
  const sentVar = sentLens.reduce((a, b) => a + (b - sentAvg) ** 2, 0) / sentLens.length;
  const sentCV = Math.sqrt(sentVar) / Math.max(sentAvg, 1);

  let score = 0;
  if (cv < 0.4) score += 30;
  if (sentCV < 0.3) score += 30;
  if (words.length > 100 && cv < 0.5 && sentCV < 0.4) score += 20;
  return Math.min(score, 100);
}

router.post('/check/:submissionId', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

    const content = submission.content || '';
    const currentWords = getWords(content);
    const currentSentences = getSentences(content);

    if (currentWords.length === 0) {
      return res.status(400).json({ success: false, message: 'Submission has no text content' });
    }

    const otherSubmissions = await Submission.find({ _id: { $ne: submission._id } });

    let bestExactMatch = 0;
    let bestSemanticMatch = 0;
    let matchedSources = [];
    let highlightedText = content;

    for (const other of otherSubmissions) {
      const otherContent = other.content || '';
      const otherWords = getWords(otherContent);
      if (otherWords.length === 0) continue;

      const commonWords = currentWords.filter(w => otherWords.includes(w.toLowerCase()));
      const exactPct = (commonWords.length / currentWords.length) * 100;

      const otherPhrases3 = new Set(getPhrases(otherWords.map(w => w.toLowerCase()), 3));
      const otherPhrases4 = new Set(getPhrases(otherWords.map(w => w.toLowerCase()), 4));
      const otherPhrases5 = new Set(getPhrases(otherWords.map(w => w.toLowerCase()), 5));

      let semanticCount = 0;
      let matchingTextParts = [];
      const currentPhrases3 = getPhrases(currentWords.map(w => w.toLowerCase()), 3);

      for (const phrase of currentPhrases3) {
        if (otherPhrases3.has(phrase) || otherPhrases4.has(phrase) || otherPhrases5.has(phrase)) {
          semanticCount++;
          matchingTextParts.push(phrase);
        }
      }
      const semanticPct = (semanticCount / Math.max(currentPhrases3.length, 1)) * 100;

      const totalSim = exactPct + semanticPct;
      if (totalSim > bestExactMatch + bestSemanticMatch) {
        bestExactMatch = exactPct;
        bestSemanticMatch = semanticPct;
        matchedSources = [{
          submission_id: other._id,
          similarity: Math.round(totalSim * 10) / 10,
          matching_text: matchingTextParts.slice(0, 5).join(' | ')
        }];
      }
    }

    const paraphrase = Math.min(bestExactMatch * 0.3, 15);
    let overallSimilarity = Math.min(bestExactMatch + bestSemanticMatch + paraphrase, 100);

    let displayText = content;
    for (const word of currentWords) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
      const isCommon = otherSubmissions.some(other => {
        const otherWords = getWords(other.content || '').map(w => w.toLowerCase());
        return otherWords.includes(word.toLowerCase());
      });
      if (isCommon && word.length > 2) {
        displayText = displayText.replace(regex, match => `<mark>${match}</mark>`);
      }
    }

    const aiScore = calculateAIHeuristics(content);

    const grammarErrors = [];
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.trim() && /^[a-z]/.test(line.trim())) {
        grammarErrors.push({ line: i + 1, message: 'Sentence may not start with a capital letter' });
      }
      if (/\s{2,}/.test(line)) {
        grammarErrors.push({ line: i + 1, message: 'Multiple consecutive spaces detected' });
      }
    });

    const report = await PlagiarismReport.create({
      submission_id: submission._id,
      overall_similarity: Math.round(overallSimilarity * 10) / 10,
      originality_score: Math.round((100 - overallSimilarity) * 10) / 10,
      ai_generated_score: Math.round(aiScore * 10) / 10,
      is_ai_generated: aiScore > 60,
      exact_match_percentage: Math.round(bestExactMatch * 10) / 10,
      semantic_match_percentage: Math.round(bestSemanticMatch * 10) / 10,
      paraphrase_percentage: Math.round(paraphrase * 10) / 10,
      matched_sources: matchedSources,
      highlighted_content: { original: content, highlighted: displayText },
      grammar_errors: grammarErrors
    });

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student_id: req.user.id });
    const subIds = submissions.map(s => s._id);
    const reports = await PlagiarismReport.find({ submission_id: { $in: subIds } })
      .populate({ path: 'submission_id', populate: { path: 'assignment_id', select: 'title course_code' } })
      .sort({ generated_at: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/submission/:submissionId', auth, async (req, res) => {
  try {
    const report = await PlagiarismReport.findOne({ submission_id: req.params.submissionId });
    if (!report) return res.status(404).json({ success: false, message: 'No plagiarism report found' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/reports', auth, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const reports = await PlagiarismReport.find().sort({ generated_at: -1 }).limit(50);
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
