const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found-err');
const AuthenticationError = require('../errors/authentication-err');
const DuplicateErrorError = require('../errors/duplicate-err');

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
    .then((hash) =>
      user.create({ name, about, avatar, email, password: hash }))
    .catch(() => { throw new DuplicateErrorError('Введенная почта уже используется') })
    .then(user => {
      const { password, ...result } = user.toObject();
      res.send({ data: result })
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user
  user.findById(userId)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе отсутствует');
      }
      res.send({ data: user })
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {

  user.findById(req.params.userId)
    .then(users => {
      if (users) {
        res.send({ data: users })
      } else {
        throw new NotFoundError('Информация о пользователе отсутствует');
      }
    })
    .catch(next);
};

module.exports.setUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user,
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
    req.user,
    { avatar },
    {
      new: true,
    }
  )
    .then(user => {
      if (!user) {
        throw new NotFoundError('Не удалось сменить аватар');
      }
      res.send({ avatar: user.avatar })
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  user.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthenticationError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthenticationError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true
          })
          res.send({ data: `${user.email} -> Авторицазия прошла успешно` })
        })
        .catch(() => { throw new AuthenticationError('Ошибка создания токена') })
    })
    .catch(next);
};

