const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  setAvatar,
  setUserInfo
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', setAvatar);
router.patch('/me', setUserInfo);


module.exports = router;