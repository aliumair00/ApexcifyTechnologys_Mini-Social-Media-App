const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_key';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

module.exports = generateToken;
