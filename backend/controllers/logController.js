const Log = require('../models/Log');

exports.createLog = async (req, res) => {
  try {
    const log = await Log.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { level, message, start, end } = req.query;

    let query = {};
    if (level) query.level = level;
    if (message) query.message = { $regex: message, $options: 'i' };
    if (start || end) query.timestamp = {
      ...(start && { $gte: new Date(start) }),
      ...(end && { $lte: new Date(end) })
    };

    const logs = await Log.find(query).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
