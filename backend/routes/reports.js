const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const PlagiarismReport = require('../models/PlagiarismReport');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { auth } = require('../middleware/auth');

router.get('/plagiarism/:submissionId', auth, async (req, res) => {
  try {
    const report = await PlagiarismReport.findOne({ submission_id: req.params.submissionId });
    const submission = await Submission.findById(req.params.submissionId).populate('assignment_id', 'title course_code');
    if (!report) return res.status(404).json({ success: false, message: 'No report found' });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=plagiarism-report-${req.params.submissionId}.pdf`);
    doc.pipe(res);

    doc.fontSize(22).font('Helvetica-Bold').text('PaliGazer Plagiarism Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`Assignment: ${submission?.assignment_id?.title || 'N/A'}`);
    doc.text(`Course: ${submission?.assignment_id?.course_code || 'N/A'}`);
    doc.text(`Date: ${new Date(report.generated_at).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text('Similarity Scores');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Overall Similarity: ${report.overall_similarity}%`);
    doc.text(`Originality Score: ${report.originality_score}%`);
    doc.text(`Exact Match: ${report.exact_match_percentage}%`);
    doc.text(`Semantic Match: ${report.semantic_match_percentage}%`);
    doc.text(`Paraphrase: ${report.paraphrase_percentage}%`);
    doc.text(`AI Generated Score: ${report.ai_generated_score}%`);
    doc.moveDown();

    if (report.matched_sources && report.matched_sources.length > 0) {
      doc.fontSize(16).font('Helvetica-Bold').text('Matched Sources');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      report.matched_sources.forEach((source, i) => {
        doc.text(`${i + 1}. Similarity: ${source.similarity}% - "${(source.matching_text || '').substring(0, 100)}..."`);
      });
      doc.moveDown();
    }

    if (report.is_ai_generated) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('red').text('⚠ Content may be AI-generated');
      doc.fillColor('black');
    }

    doc.end();
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

module.exports = router;
