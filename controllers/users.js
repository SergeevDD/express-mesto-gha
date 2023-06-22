const user = require('../models/user');
const trowError = require('../utils/errors')

module.exports.getUsers = (req, res) => {
  user.find({})
    .then(users => res.send({ data: users }))
    .catch(err => trowError(res, err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => trowError(res, err));
};

module.exports.getUserById = (req, res) => {
  user.findById(req.params.userId)
    .then(users => res.send({ data: users }))
    .catch(err => trowError(res, err));
};

module.exports.setUserInfo = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .then(users => {res.send({ data: users })})
    .catch(err => trowError(res, err));
};

module.exports.setAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then(users => res.send({ data: users }))
    .catch(err => trowError(res, err));
};