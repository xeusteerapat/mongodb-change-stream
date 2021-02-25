const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  score: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Score', ScoreSchema);
