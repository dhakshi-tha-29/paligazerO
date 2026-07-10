const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['article', 'course', 'tutorial', 'video', 'paper'], required: true },
  url: String,
  domain: String,
  provider: String,
  difficulty: String,
  duration: String,
  recommended_for: String
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
