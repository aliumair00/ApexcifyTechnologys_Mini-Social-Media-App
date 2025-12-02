const express = require('express');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const validateObjectId = require('../middleware/validateObjectId');
const { getProfile, updateProfile, uploadAvatar, uploadBanner, searchUsers, getFollowers, getFollowing } = require('../controllers/userController');
const { followUser, unfollowUser } = require('../controllers/followController');

const router = express.Router();

router.get('/search', auth, searchUsers);

router.get('/:id', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/profile-picture', auth, upload.single('image'), uploadAvatar);
router.post('/banner', auth, upload.single('image'), uploadBanner);

router.get('/:id/followers', auth, validateObjectId('id'), getFollowers);
router.get('/:id/following', auth, validateObjectId('id'), getFollowing);

router.post('/:id/follow', auth, validateObjectId('id'), followUser);
router.delete('/:id/follow', auth, validateObjectId('id'), unfollowUser);

module.exports = router;
