const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/tokenStore');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists with this email.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
  });

  const access_token = createToken(user._id);

  return res.json({
    access_token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const access_token = createToken(user._id);

  return res.json({
    access_token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};

exports.profile = async (req, res) => {
  return res.json({ user: req.user });
};
