const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Please add company name'],
    trim: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Please add job title'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add role'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
    trim: true
  },
  salary: {
    type: String,
    required: [true, 'Please add salary'],
    trim: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    required: [true, 'Please add experience requirement']
  },
  description: {
    type: String,
    required: [true, 'Please add job description']
  },
  requirements: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  companyLogo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
