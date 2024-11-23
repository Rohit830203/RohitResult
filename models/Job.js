const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  salaryRange: { type: String },
  applyLink: { type: String },
  notifications: [
    {
      nameOfPost: { type: String },
      postDate: { type: String },
      shortInfo: { type: String },
      requirementTitle: { type: String },
      examTitle: { type: String },
      websiteLink: { type: String },
      applicationBegin: { type: String },
      lastDateApply: { type: String },
      lastDatePayExamFee: { type: String },
      examDate: { type: String },
      admitCardAvailable: { type: String },
      generalFee: { type: String },
      scStPhFee: { type: String },
      additionalInfo: { type: String },
      Title: { type: String },
      StartDate: { type: String },
      EndDate: { type: String },
      AgeRelaxation: { type: String },
      dynamicInputs: [mongoose.Schema.Types.Mixed],  // Allow dynamic fields
      additionalDates: [                            // New field for additional dates
        {
          dateValue: { type: String }  // Assuming dates are stored as strings
        }
      ]
    }
  ]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;  // Export the Job model

