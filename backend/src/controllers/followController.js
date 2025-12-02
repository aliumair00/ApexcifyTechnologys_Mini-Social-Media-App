const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (req.user._id.toString() === targetId) {
    return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
  }
  const target = await User.findById(targetId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const already = req.user.following.some((id) => id.toString() === targetId);
  if (already) {
    return res.status(400).json({ success: false, message: 'Already following' });
  }
  req.user.following.push(target._id);
  target.followers.push(req.user._id);
  await req.user.save();
  await target.save();
  return res.status(200).json({ followersCount: target.followers.length, followingCount: req.user.following.length });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const target = await User.findById(targetId);
  if (!target) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  req.user.following = req.user.following.filter((id) => id.toString() !== targetId);
  target.followers = target.followers.filter((id) => id.toString() !== req.user._id.toString());
  await req.user.save();
  await target.save();
  return res.status(200).json({ followersCount: target.followers.length, followingCount: req.user.following.length });
});

module.exports = { followUser, unfollowUser };
