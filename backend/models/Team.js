const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project_title: String,
  domain: String
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
