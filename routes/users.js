const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getCurrentUser,
  getUserById,
  setAvatar,
  setUserInfo
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch('/me/avatar', setAvatar);
router.patch('/me', setUserInfo);


module.exports = router;