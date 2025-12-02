const express = require('express');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const validateObjectId = require('../middleware/validateObjectId');
const { createPost, getPosts, getPostById, deletePost, getUserPosts, likePost, unlikePost, getFeed } = require('../controllers/postController');
const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
// duplicate removed

const router = express.Router();

router.get('/', auth, getPosts);
router.post('/', auth, upload.array('images', 4), createPost);

router.get('/feed', auth, getFeed);

router.get('/:id', auth, validateObjectId('id'), getPostById);
router.delete('/:id', auth, validateObjectId('id'), deletePost);

router.get('/user/:id', auth, validateObjectId('id'), getUserPosts);

router.post('/:id/like', auth, validateObjectId('id'), likePost);
router.delete('/:id/like', auth, validateObjectId('id'), unlikePost);

// Update post (content and optional images)
router.put('/:id', auth, validateObjectId('id'), upload.array('images', 4), asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Forbidden' });
  const content = req.body.content ?? post.content;
  let images = Array.isArray(post.images) ? post.images : (post.image ? [post.image] : []);
  if (req.files && req.files.length) {
    const cloudinary = require('../config/cloudinary');
    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    if (hasCloudinary) {
      const uploadOne = (file) => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'mini-social/posts' }, (error, res1) => {
          if (error) reject(error); else resolve(res1.secure_url);
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
  post.content = content;
  post.images = images;
  await post.save();
  const populated = await Post.findById(post._id).populate('user', 'name username profilePicture');
  const Comment = require('../models/Comment');
  const commentsCount = await Comment.countDocuments({ post: post._id });
  return res.status(200).json({
    _id: populated._id,
    content: populated.content,
    images: Array.isArray(populated.images) ? populated.images : [],
    image: (Array.isArray(populated.images) && populated.images[0]) ? populated.images[0] : '',
    likes: populated.likes.map((id) => id.toString()),
    createdAt: populated.createdAt,
    author: {
      _id: populated.user._id,
      name: populated.user.name,
      username: populated.user.username,
      profilePicture: populated.user.profilePicture,
    },
    commentsCount,
  });
}));

module.exports = router;
