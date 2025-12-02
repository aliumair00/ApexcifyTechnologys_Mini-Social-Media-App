const express = require('express');
const auth = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.get('/posts/:postId/comments', auth, validateObjectId('postId'), getComments);
router.post('/posts/:postId/comments', auth, validateObjectId('postId'), addComment);
router.delete('/posts/:postId/comments/:id', auth, validateObjectId('postId'), validateObjectId('id'), deleteComment);

module.exports = router;

