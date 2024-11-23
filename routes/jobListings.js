const express = require('express');
const multer = require('multer');
const router = express.Router();
const JobListing = require('../models/JobListing');
const mongoose = require('mongoose');

// Set up multer to store the file in the 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Change this to wherever you want to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Unique filename
  }
});

const upload = multer({ storage: storage });

// Get all job listings
router.get('/', async (req, res) => {
  try {
    const jobListings = await JobListing.find();
    res.json(jobListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new job listing
router.post('/', upload.single('pdfFile'), async (req, res) => {
  const { listingTitle, applyLink } = req.body;

  // Handle the uploaded file and store its URL
  const pdfFile = req.file ? '/uploads/' + req.file.filename : null;

  const newJobListing = new JobListing({
    listingTitle,
    applyLink,
    pdfFile,  // Store the PDF file URL
  });

  try {
    const savedJobListing = await newJobListing.save();
    res.status(201).json(savedJobListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a job listing
router.put('/:id', upload.single('pdfFile'), async (req, res) => {
  const { listingTitle, applyLink } = req.body;

  try {
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    jobListing.listingTitle = listingTitle;
    jobListing.applyLink = applyLink;

    // Update PDF if new one is provided, otherwise retain old PDF
    if (req.file) {
      jobListing.pdfFile = '/uploads/' + req.file.filename;  // Save the new PDF URL
    }

    const updatedJobListing = await jobListing.save();
    res.json(updatedJobListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a job listing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid job listing ID' });
    }

    const jobListing = await JobListing.findById(id);
    if (!jobListing) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    await JobListing.findByIdAndDelete(id);
    res.json({ message: 'Job listing deleted' });
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
