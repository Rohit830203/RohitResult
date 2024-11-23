const express = require('express');
const Table = require('../models/tableDataModel');
const router = express.Router();

// Route to get all table data
router.get('/tables/:name', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables); // Return all tables as an array
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tables', error: err.message });
  }
});
// Route to get all table data
router.get('/tables', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables); // Return all tables as an array
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tables', error: err.message });
  }
});

// Route to get a single table by id
router.get('/tables/:id', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id); // Find a table by its ID
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table); // Return the found table
  } catch (err) {
    res.status(500).json({ message: 'Error fetching table for editing', error: err.message });
  }
});

// Route to create a new table entry
router.post('/tables', async (req, res) => {
  const { jobTitle, data } = req.body;

  // Ensure that jobTitle and data are provided in the request body
  if (!jobTitle || !data) {
    return res.status(400).json({ message: 'Job title and data are required' });
  }

  const newTable = new Table({
    jobTitle,
    data,
  });

  try {
    const savedTable = await newTable.save(); // Save the new table to the database
    res.status(201).json(savedTable); // Respond with the saved table
  } catch (err) {
    res.status(400).json({ message: 'Error saving table', error: err.message });
  }
});

// Route to update table data by id
router.put('/tables/:id', async (req, res) => {
  const { jobTitle, data } = req.body;

  // Validate that the required fields are provided
  if (!jobTitle || !data) {
    return res.status(400).json({ message: 'Job title and data are required' });
  }

  try {
    // Attempt to find and update the table by ID
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id, // Table ID from the URL
      { jobTitle, data }, // Updated fields
      { new: true } // Return the updated table
    );
    if (!updatedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(updatedTable); // Respond with the updated table
  } catch (err) {
    res.status(400).json({ message: 'Error updating table', error: err.message });
  }
});

// Route to delete a table by id
router.delete('/tables/:id', async (req, res) => {
  try {
    const deletedTable = await Table.findByIdAndDelete(req.params.id); // Delete the table by ID
    if (!deletedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json({ message: 'Table deleted successfully', table: deletedTable }); // Respond with success
  } catch (err) {
    res.status(400).json({ message: 'Error deleting table', error: err.message });
  }
});

module.exports = router;
