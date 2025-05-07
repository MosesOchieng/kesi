const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user
router.get('/user/:userId', async (req, res) => {
  const notes = await Notification.find({ user: req.params.userId });
  res.json(notes);
});

// Create notification
router.post('/', async (req, res) => {
  const { user, type, message } = req.body;
  const note = new Notification({ user, type, message });
  await note.save();
  res.json(note);
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  const note = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(note);
});

// Delete notification
router.delete('/:id', async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 