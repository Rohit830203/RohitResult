const mongoose = require('mongoose');

const jobListingSchema = new mongoose.Schema({
  listingTitle: { type: String, required: true },
  applyLink: { type: String, required: true },
  pdfFile: { type: String, required: false }, // PDF file URL will be stored here
});

module.exports = mongoose.model('JobListing', jobListingSchema);
