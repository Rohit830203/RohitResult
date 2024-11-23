const mongoose = require('mongoose');

// Define the table schema
const tableSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  data: {
    title1: String,
    link1: String,
    title2: String,
    link2: String,
    pdfTitle: String,
    pdfPath: String,
  },
});

// Create the Item model based on the tableSchema
const Item = mongoose.model('Item', tableSchema);

module.exports = Item;
