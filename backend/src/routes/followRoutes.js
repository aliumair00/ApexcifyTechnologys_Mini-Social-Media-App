const express = require('express');
const auth = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { followUser, unfollowUser } = require('../controllers/followController');

const router = express.Router({ mergeParams: true });

router.post('/:id/follow', auth, validateObjectId('id'), followUser);
router.delete('/:id/follow', auth, validateObjectId('id'), unfollowUser);

module.exports = router;

