const { getUserIdFromToken } = require('../utils/tokenStore');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
  }

  const token = authHeader.slice(7).trim();

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token or user not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
