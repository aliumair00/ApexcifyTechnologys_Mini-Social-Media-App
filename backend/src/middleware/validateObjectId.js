const mongoose = require('mongoose');

const validateObjectId = (paramKey = 'id') => (req, res, next) => {
  const id = req.params[paramKey];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }
  next();
};

module.exports = validateObjectId;

