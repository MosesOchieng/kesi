const mongoose = require('mongoose');
const evidenceSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  type: { type: String, enum: ['text', 'image', 'video', 'document'], required: true },
  url: String,
  description: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Evidence', evidenceSchema); 