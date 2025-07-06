const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  timestamp: Date,
  service: String
});

module.exports = mongoose.model('Log', logSchema);
