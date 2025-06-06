const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all cases
router.get('/', async (req, res) => {
  const cases = await Case.find().populate('participants.user').populate('evidence');
  res.json(cases);
});

// Get a single case
router.get('/:id', async (req, res) => {
  const c = await Case.findById(req.params.id).populate('participants.user').populate('evidence');
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c);
});

// Create a case
router.post('/', async (req, res) => {
  const { title, description, participants } = req.body;
  const c = new Case({ title, description, participants });
  await c.save();
  res.json(c);
});

// Update a case
router.put('/:id', async (req, res) => {
  const c = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(c);
});

// Delete a case
router.delete('/:id', async (req, res) => {
  await Case.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// AI-generated case (stub)
router.post('/ai-generate', auth, async (req, res) => {
  // In production, call an AI service here
  const { userId } = req.user;
  const aiCase = new Case({
    title: 'AI-Generated Case',
    description: 'This case was generated by AI for simulation purposes.',
    type: 'ai',
    participants: [{ user: userId, role: 'Lawyer' }]
  });
  await aiCase.save();
  res.json(aiCase);
});

// Manual case creation
router.post('/manual', auth, async (req, res) => {
  const { title, description, participants } = req.body;
  const userId = req.user.id;
  const manualCase = new Case({
    title,
    description,
    type: 'manual',
    participants: participants || [{ user: userId, role: 'Lawyer' }]
  });
  await manualCase.save();
  res.json(manualCase);
});

// List historical cases
router.get('/historical', async (req, res) => {
  const cases = await Case.find({ type: 'historical' });
  res.json(cases);
});

// Join a case
router.post('/:id/join', auth, async (req, res) => {
  const userId = req.user.id;
  const { role } = req.body;
  const c = await Case.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  if (!c.participants.some(p => p.user.toString() === userId)) {
    c.participants.push({ user: userId, role: role || 'Lawyer' });
    await c.save();
  }
  res.json(c);
});

// Leave a case
router.post('/:id/leave', auth, async (req, res) => {
  const userId = req.user.id;
  const c = await Case.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  c.participants = c.participants.filter(p => p.user.toString() !== userId);
  await c.save();
  res.json(c);
});

// Assign role
router.post('/:id/assign-role', auth, async (req, res) => {
  const userId = req.user.id;
  const { role } = req.body;
  const c = await Case.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  const participant = c.participants.find(p => p.user.toString() === userId);
  if (participant) {
    participant.role = role;
    await c.save();
  }
  res.json(c);
});

// Seed five example cases (AI, manual, historical)
router.post('/seed', async (req, res) => {
  // Only allow in development or with a secret
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Forbidden' });
  await Case.deleteMany({});
  const cases = [
    { title: 'Roe v. Wade', description: 'Landmark decision on abortion rights.', type: 'historical', source: 'https://en.wikipedia.org/wiki/Roe_v._Wade' },
    { title: 'Brown v. Board of Education', description: 'Desegregation of public schools.', type: 'historical', source: 'https://en.wikipedia.org/wiki/Brown_v._Board_of_Education' },
    { title: 'AI Theft Case', description: 'AI-generated case about intellectual property.', type: 'ai' },
    { title: 'Manual Contract Dispute', description: 'User-uploaded case about a contract dispute.', type: 'manual' },
    { title: 'AI Fraud Simulation', description: 'AI-generated case about financial fraud.', type: 'ai' }
  ];
  const created = await Case.insertMany(cases);
  res.json(created);
});

module.exports = router; 