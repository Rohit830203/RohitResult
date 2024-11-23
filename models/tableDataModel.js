const mongoose = require('mongoose');

// Define the schema for the table data
const tableSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  data: {
    type: [[String]], // Array of arrays to store table data
    required: true,
  },
});

// Create the model for the table data
const Table = mongoose.model('Table', tableSchema);

module.exports = Table;
