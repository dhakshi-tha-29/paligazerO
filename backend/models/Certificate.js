const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['workshop', 'project', 'course'], required: true },
  title: { type: String, required: true },
  description: String,
  issued_by: String,
  issue_date: String,
  certificate_url: String,
  certificate_id: { type: String, unique: true },
  status: { type: String, enum: ['issued', 'revoked', 'expired'], default: 'issued' },
  expiry_date: String,
  skills: [String],
  badge_url: String,
  verification_code: { type: String, unique: true },
  credits: Number
}, { timestamps: true });

certificateSchema.pre('save', function () {
  if (!this.certificate_id) {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.certificate_id = `CERT-${year}-${random}`;
  }
  if (!this.verification_code) {
    this.verification_code = crypto.randomBytes(6).toString('hex').toUpperCase();
  }
});

module.exports = mongoose.model('Certificate', certificateSchema);
