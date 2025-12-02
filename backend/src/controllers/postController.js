const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const cloudinary = require('../config/cloudinary');

const formatPost = async (post) => {
  const commentsCount = await Comment.countDocuments({ post: post._id });
  const images = Array.isArray(post.images) ? post.images : (post.image ? [post.image] : []);
  return {
    _id: post._id,
    content: post.content,
    images,
    image: images[0] || '',
    likes: post.likes.map((id) => id.toString()),
    createdAt: post.createdAt,
    author: {
      _id: post.user._id,
      name: post.user.name,
      username: post.user.username,
      profilePicture: post.user.profilePicture,
    },
    commentsCount,
  };
};

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content && !(req.files && req.files.length)) {
    return res.status(400).json({ success: false, message: 'Content or image required' });
  }
  let images = [];
  if (req.files && req.files.length) {
    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (hasCloudinary) {
      const uploadOne = (file) => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'mini-social/posts' }, (error, result) => {
          if (error) reject(error); else resolve(result.secure_url);
        });
        stream.end(file.buffer);
      });
      images = await Promise.all(req.files.map(uploadOne));
    } else {
      const saveBuffer = require('../utils/saveBuffer');
      const urls = await Promise.all(
        req.files.map(async (f) => {
          const u = await saveBuffer(f.buffer, 'posts', f.originalname || 'post.jpg');
          return `${req.protocol}://${req.get('host')}${u}`;
        })
      );
      images = urls;
    }
  }
  const post = await Post.create({ user: req.user._id, content: content || '', images });
  const populated = await Post.findById(post._id).populate('user', 'name username profilePicture');
  const formatted = await formatPost(populated);
  return res.status(201).json(formatted);
});

const getPosts = asyncHandler(async (req, res) => {
  const ids = [req.user._id, ...req.user.following];
  const posts = await Post.find({ user: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate('user', 'name username profilePicture');
  const formatted = await Promise.all(posts.map((p) => formatPost(p)));
  return res.status(200).json(formatted);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', 'name username profilePicture');
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  const formatted = await formatPost(post);
  return res.status(200).json(formatted);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  await Post.deleteOne({ _id: post._id });
  return res.status(200).json({});
});

const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .populate('user', 'name username profilePicture');
  const formatted = await Promise.all(posts.map((p) => formatPost(p)));
  return res.status(200).json(formatted);
});

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  const already = post.likes.some((id) => id.toString() === req.user._id.toString());
  if (already) {
    return res.status(400).json({ success: false, message: 'Already liked' });
  }
  post.likes.push(req.user._id);
  await post.save();
  return res.status(200).json({ likesCount: post.likes.length, likes: post.likes.map((id) => id.toString()) });
});

const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
  await post.save();
  return res.status(200).json({ likesCount: post.likes.length, likes: post.likes.map((id) => id.toString()) });
});

const getFeed = asyncHandler(async (req, res) => {
  const ids = [req.user._id, ...req.user.following];
  const posts = await Post.find({ user: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate('user', 'name username profilePicture');
  const formatted = await Promise.all(posts.map((p) => formatPost(p)));
  return res.status(200).json(formatted);
});

module.exports = { createPost, getPosts, getPostById, deletePost, getUserPosts, likePost, unlikePost, getFeed };
