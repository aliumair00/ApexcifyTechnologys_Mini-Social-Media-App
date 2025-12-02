const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  const existsUsername = await User.findOne({ username: username.toLowerCase() });
  if (existsUsername) {
    return res.status(400).json({ success: false, message: 'Username already taken' });
  }
  const existsEmail = await User.findOne({ email: email.toLowerCase() });
  if (existsEmail) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, username: username.toLowerCase(), email: email.toLowerCase(), password: hashed });
  return res.status(201).json({ _id: user._id, name: user.name, username: user.username, email: user.email });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
  const token = generateToken(user._id);
  return res.status(200).json({ user: { _id: user._id, name: user.name, username: user.username, email: user.email, profilePicture: user.profilePicture }, token });
});

const me = asyncHandler(async (req, res) => {
  const user = req.user;
  const followersCount = user.followers.length;
  const followingCount = user.following.length;
  return res.status(200).json({ _id: user._id, name: user.name, username: user.username, email: user.email, profilePicture: user.profilePicture, bio: user.bio, followersCount, followingCount });
});

const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({});
});

module.exports = { register, login, me, logout };
