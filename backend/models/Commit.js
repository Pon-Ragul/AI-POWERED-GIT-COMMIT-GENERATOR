const mongoose = require('mongoose');

const commitSchema = new mongoose.Schema({
  gitDiff: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    default: 'conventional',
  },
  commitTitle: {
    type: String,
    required: true,
  },
  commitBody: {
    type: String,
    default: '',
  },
  confidence: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Commit', commitSchema);
