const mongoose = require('mongoose');
const caseSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['ai', 'manual', 'historical'], default: 'manual' },
  source: String, // for historical cases (e.g., reference link or summary)
  participants: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String }],
  status: { type: String, default: 'Ongoing' },
  evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Case', caseSchema); 