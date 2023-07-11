const user = require('../models/user');
const sendError = require('../utils/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then(users => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.send({ data: users })
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({ name, about, avatar, email, hash }))
    .then(user => {
      if (!user) {
        throw new NotFoundError('При создании пользователя произошла ошибка');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const user = req.user
  user.find({ user })
    .then(user => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе отсутствует');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  if (ObjectId.isValid(req.params.userId)) {
    user.findById(req.params.userId)
      .then(users => {
        if (users) {
          res.send({ data: users })
        } else {
          throw new NotFoundError('Информация о пользователе отсутствует');
        }
      })
      .catch(next);
  } else {
    throw new IncorrectDataError('Переданы некорректные данные');
  }
};

module.exports.setUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then(users => {
      if (!users) {
        throw new NotFoundError('Не удалось обновить данные пользователя');
      }
      res.send({ data: users })
    })
    .catch(next);
};

module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then(user => {
      if (!user) {
        throw new NotFoundError('Не удалось сменить аватар');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user.findUserByCredentials(email).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthenticationError('Пользователь не найден');
      }
      const token = jwt.sign(
        { _id: user._id },
        'sekretka',
        { expiresIn: '7d' }
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true
      })
    })
    .end()
    .catch(next);
};

