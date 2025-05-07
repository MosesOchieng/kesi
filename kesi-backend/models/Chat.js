const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
  case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  agent: String, // e.g., 'Judge', 'Prosecutor', etc.
  messages: [
    {
      sender: String, // 'user' or 'agent'
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', chatSchema); 