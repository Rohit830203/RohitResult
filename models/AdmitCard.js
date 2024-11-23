// models/AdmitCard.js
const mongoose = require('mongoose');

const AdmitCardSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  applyLink: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('AdmitCard', AdmitCardSchema);
