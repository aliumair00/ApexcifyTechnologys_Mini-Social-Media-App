const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Content is required' });
  }
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  const comment = await Comment.create({ user: req.user._id, post: postId, content });
  const populated = await Comment.findById(comment._id).populate('user', 'name username profilePicture');
  const formatted = { _id: populated._id, content: populated.content, createdAt: populated.createdAt, author: { _id: populated.user._id, name: populated.user.name, username: populated.user.username, profilePicture: populated.user.profilePicture } };
  return res.status(201).json(formatted);
});

const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  const comments = await Comment.find({ post: postId }).sort({ createdAt: 1 }).populate('user', 'name username profilePicture');
  const formatted = comments.map((c) => ({ _id: c._id, content: c.content, createdAt: c.createdAt, author: { _id: c.user._id, name: c.user.name, username: c.user.username, profilePicture: c.user.profilePicture } }));
  return res.status(200).json(formatted);
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  await Comment.deleteOne({ _id: comment._id });
  return res.status(200).json({});
});

module.exports = { addComment, getComments, deleteComment };
