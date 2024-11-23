// routes/admitCardRoutes.js
const express = require('express');
const router = express.Router();
const AdmitCard = require('../models/AdmitCard'); // Ensure the path is correct

// Get all admit cards
router.get('/', async (req, res) => {
  try {
    const admitCards = await AdmitCard.find();
    res.json(admitCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new admit card
router.post('/', async (req, res) => {
  const admitCard = new AdmitCard({
    jobTitle: req.body.jobTitle,
    applyLink: req.body.applyLink,
  });

  try {
    const newAdmitCard = await admitCard.save();
    res.status(201).json(newAdmitCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an admit card
router.put('/:id', async (req, res) => {
  try {
    const updatedAdmitCard = await AdmitCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAdmitCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an admit card
router.delete('/:id', async (req, res) => {
  try {
    await AdmitCard.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admit card deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
