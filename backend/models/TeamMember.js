const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, default: 'member' },
  contribution_percentage: { type: Number, default: 0 },
  joined_at: { type: Date, default: Date.now }
}, { timestamps: false });

teamMemberSchema.index({ team_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
