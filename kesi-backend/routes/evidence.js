const express = require('express');
const router = express.Router();
const Evidence = require('../models/Evidence');

// Get all evidence
router.get('/', async (req, res) => {
  const evidence = await Evidence.find().populate('case').populate('uploadedBy');
  res.json(evidence);
});

// Get evidence for a case
router.get('/case/:caseId', async (req, res) => {
  const evidence = await Evidence.find({ case: req.params.caseId }).populate('uploadedBy');
  res.json(evidence);
});

// Create evidence (file upload logic to be added)
router.post('/', async (req, res) => {
  const { case: caseId, type, url, description, uploadedBy } = req.body;
  const ev = new Evidence({ case: caseId, type, url, description, uploadedBy });
  await ev.save();
  res.json(ev);
});

// Delete evidence
router.delete('/:id', async (req, res) => {
  await Evidence.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router; 