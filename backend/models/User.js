const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  phone: String,
  avatar: String,
  department: String,
  institution: String,
  is_verified: { type: Boolean, default: false },
  verification_token: String,
  reset_token: String,
  reset_token_expiry: Date,
  preferred_language: { type: String, default: 'en' }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verification_token;
  delete obj.reset_token;
  delete obj.reset_token_expiry;
  obj.id = obj._id.toString();
  return obj;
};

module.exports = mongoose.model('User', userSchema);
