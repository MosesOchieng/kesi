const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');

// Get all posts
router.get('/', async (req, res) => {
  const posts = await CommunityPost.find().populate('user').populate('comments.user');
  res.json(posts);
});

// Create post
router.post('/', async (req, res) => {
  const { user, title, content } = req.body;
  const post = new CommunityPost({ user, title, content });
  await post.save();
  res.json(post);
});

// Add comment
router.post('/:id/comment', async (req, res) => {
  const { user, text } = req.body;
  const post = await CommunityPost.findById(req.params.id);
  post.comments.push({ user, text });
  await post.save();
  res.json(post);
});

// Delete post
router.delete('/:id', async (req, res) => {
  await CommunityPost.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 