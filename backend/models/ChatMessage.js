const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  response: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
