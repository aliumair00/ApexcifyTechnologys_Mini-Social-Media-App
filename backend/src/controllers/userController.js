const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const getProfile = asyncHandler(async (req, res) => {
  const identifier = req.params.id;
  let user;
  const mongoose = require('mongoose');
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    user = await User.findById(identifier);
  } else {
    user = await User.findOne({ username: identifier.toLowerCase() });
  }
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const followersCount = user.followers.length;
  const followingCount = user.following.length;
  return res.status(200).json({ _id: user._id, name: user.name, username: user.username, bio: user.bio, profilePicture: user.profilePicture, banner: user.banner, followersCount, followingCount });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, username, bio } = req.body;
  const user = req.user;
  if (username && username.toLowerCase() !== user.username) {
    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }
  }
  user.name = name ?? user.name;
  user.username = username ? username.toLowerCase() : user.username;
  user.bio = bio ?? user.bio;
  await user.save();
  return res.status(200).json({ _id: user._id, name: user.name, username: user.username, bio: user.bio, profilePicture: user.profilePicture, banner: user.banner });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }
  const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (hasCloudinary) {
    const stream = cloudinary.uploader.upload_stream({ folder: 'mini-social/avatars' }, async (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
      req.user.profilePicture = result.secure_url;
      await req.user.save();
      return res.status(200).json({ profilePicture: req.user.profilePicture });
    });
    stream.end(file.buffer);
    return;
  }
  const saveBuffer = require('../utils/saveBuffer');
  const url = await saveBuffer(file.buffer, 'avatars', file.originalname || 'avatar.jpg');
  req.user.profilePicture = `${req.protocol}://${req.get('host')}${url}`;
  await req.user.save();
  return res.status(200).json({ profilePicture: req.user.profilePicture });
});

const uploadBanner = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }
  const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (hasCloudinary) {
    const stream = cloudinary.uploader.upload_stream({ folder: 'mini-social/banners' }, async (error, result) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
      req.user.banner = result.secure_url;
      await req.user.save();
      return res.status(200).json({ banner: req.user.banner });
    });
    stream.end(file.buffer);
    return;
  }
  const saveBuffer = require('../utils/saveBuffer');
  const url = await saveBuffer(file.buffer, 'banners', file.originalname || 'banner.jpg');
  req.user.banner = `${req.protocol}://${req.get('host')}${url}`;
  await req.user.save();
  return res.status(200).json({ banner: req.user.banner });
});

const searchUsers = asyncHandler(async (req, res) => {
  const q = (req.query.q || req.query.query || '').toString().toLowerCase();
  if (!q) {
    return res.status(200).json({ success: true, message: 'Empty query', data: [] });
  }
  const users = await User.find({ username: { $regex: q, $options: 'i' } }).limit(20);
  const results = users.map((u) => ({ _id: u._id, name: u.name, username: u.username, bio: u.bio, profilePicture: u.profilePicture }));
  return res.status(200).json(results);
});

const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('followers', 'name username profilePicture');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.status(200).json(user.followers);
});

const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('following', 'name username profilePicture');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.status(200).json(user.following);
});

module.exports = { getProfile, updateProfile, uploadAvatar, uploadBanner, searchUsers, getFollowers, getFollowing };
