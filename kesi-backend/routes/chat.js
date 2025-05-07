const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Get chat history for a case
router.get('/case/:caseId', async (req, res) => {
  const chats = await Chat.find({ case: req.params.caseId }).populate('user');
  res.json(chats);
});

// Post a new chat message
router.post('/', async (req, res) => {
  const { case: caseId, user, agent, message } = req.body;
  let chat = await Chat.findOne({ case: caseId, user, agent });
  if (!chat) {
    chat = new Chat({ case: caseId, user, agent, messages: [] });
  }
  chat.messages.push({ sender: 'user', text: message });
  // Demo AI response
  chat.messages.push({ sender: 'agent', text: `AI response from ${agent}.` });
  await chat.save();
  res.json(chat);
});

module.exports = router; 