const mongoose = require('mongoose');

const plagiarismReportSchema = new mongoose.Schema({
  submission_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  overall_similarity: Number,
  originality_score: Number,
  ai_generated_score: Number,
  is_ai_generated: { type: Boolean, default: false },
  exact_match_percentage: Number,
  semantic_match_percentage: Number,
  paraphrase_percentage: Number,
  citation_errors: mongoose.Schema.Types.Mixed,
  matched_sources: mongoose.Schema.Types.Mixed,
  highlighted_content: mongoose.Schema.Types.Mixed,
  grammar_errors: mongoose.Schema.Types.Mixed,
  generated_at: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('PlagiarismReport', plagiarismReportSchema);
