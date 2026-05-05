const crypto = require('crypto');

const tokens = new Map();

const createToken = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  tokens.set(token, String(userId));
  return token;
};

const getUserIdFromToken = (token) => {
  return tokens.get(token) || null;
};

const revokeToken = (token) => {
  return tokens.delete(token);
};

module.exports = {
  createToken,
  getUserIdFromToken,
  revokeToken,
};
