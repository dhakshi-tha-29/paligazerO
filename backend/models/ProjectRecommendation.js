const mongoose = require('mongoose');

const projectRecommendationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  domain: String,
  difficulty: String,
  technologies: String
}, { timestamps: true });

module.exports = mongoose.model('ProjectRecommendation', projectRecommendationSchema);
