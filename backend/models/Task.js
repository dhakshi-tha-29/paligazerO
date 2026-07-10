const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  due_date: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
