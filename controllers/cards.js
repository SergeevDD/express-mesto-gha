const card = require('../models/card');
const trowError = require('../utils/errors');

module.exports.createCard = (req, res) => {

  const {
    name,
    link,
    owner = req.user._id,
    likes = [],
    createAt
  } = req.body;

  card.create({
    name,
    link,
    owner,
    likes,
    createAt
  })
    .then(card => res.send({ data: card }))
    .catch(err => trowError(res,err));
};

module.exports.getCards = (req, res) => {
  card.find({})
    .populate('owner')
    .then(cards => res.send({ data: cards }))
    .catch(err => trowError(res,err));
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then(cards => res.send({ data: cards }))
    .catch(err => trowError(res,err));
};

module.exports.addLike = (req, res) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    })
    .then(cards => res.send({ data: cards }),)
    .catch(err => trowError(res,err));
};

module.exports.removeLike = (req, res) => {

  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    }
  )
    .then(cards => res.send({ data: cards }))
    .catch(err => trowError(res,err));
};