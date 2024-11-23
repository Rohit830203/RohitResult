const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/itemModel'); // Import Item model
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname); // Use a timestamp for filename
    cb(null, fileName); // Save with the timestamped filename
  }
});

const upload = multer({ storage });

// Endpoint to handle form data submission (Create)
router.post('/', upload.single('pdf'), async (req, res) => {
  const { title1, link1, title2, link2, pdfTitle, jobTitle } = req.body;

  // Validate if all necessary fields are provided
  if (!title1 || !link1 || !pdfTitle || !jobTitle) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const pdfPath = req.file ? `uploads/${req.file.filename}` : null; // Save the relative path in the database

  try {
    const newItem = new Item({
      jobTitle,
      data: {
        title1,
        link1,
        title2,
        link2,
        pdfTitle,
        pdfPath
      }
    });

    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error saving item:', error); // Log the error to the console
    res.status(500).json({ message: 'Error saving item', error: error.message });
  }
});

// Endpoint to fetch all items (Read)
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items); // Return the items
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Endpoint to fetch items by jobTitle (Read by jobTitle)
router.get('/:jobTitle', async (req, res) => {
  const { jobTitle } = req.params;  // Extract the jobTitle from the URL

  try {
    const items = await Item.find({ jobTitle });  // Find items with the matching jobTitle
    if (items.length === 0) {
      return res.status(404).json({ message: `No items found for job title: ${jobTitle}` });
    }
    res.status(200).json(items); // Return the matching items
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Endpoint to update an item (Edit)
router.put('/:id', upload.single('pdf'), async (req, res) => {
  const { id } = req.params;
  const { title1, link1, title2, link2, pdfTitle, jobTitle } = req.body;
  let pdfPath = req.file ? `uploads/${req.file.filename}` : null;

  // Validate if required fields are present
  if (!title1 || !link1 || !pdfTitle || !jobTitle) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        jobTitle,
        data: {
          title1,
          link1,
          title2,
          link2,
          pdfTitle,
          pdfPath: pdfPath || undefined // If no new file, keep the old path
        }
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
});

// Endpoint to delete an item (Delete)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

module.exports = router;
