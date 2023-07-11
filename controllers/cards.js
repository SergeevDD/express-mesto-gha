const card = require('../models/card');
const sendError = require('../utils/errors');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.createCard = (req, res, next) => {

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
    .then(card => {
      if (!card) {
        throw new NotFoundError('Не удалось создать картточку');
      }
      res.send({ data: card })})
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  card.find({})
    .populate('owner')
    .then(cards => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
      res.send({ data: cards })})
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner === req.user) {
        return card.remove();
      }
    })
    .then((xx) => {console.log(xx);})
    .catch(next)
  /* if (ObjectId.isValid(req.params.cardId)) {
    card.findByIdAndRemove(req.params.cardId)
      .then(cards => {
        if (cards) {
          res.send({ data: cards })
        } else {
          return Promise.reject({ name: 'CastError' })
        }
      })
      .catch(err => sendError(res, err));
  } else {
    sendError(res, { name: 'ValidationError' })
  } */
};

module.exports.addLike = (req, res, next) => {
  if (ObjectId.isValid(req.params.cardId)) {
    card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      {
        new: true,
        runValidators: true,
      })
      .then(cards => {
        if (cards) {
          res.send({ data: cards })
        } else {
          if (!card) {
            throw new NotFoundError('Не удалось создать карту');
          }
        }
      })
      .catch(next);
  } else {
    throw new IncorrectDataError('Переданы некорректные данные');
  }
};

module.exports.removeLike = (req, res, next) => {
  if (ObjectId.isValid(req.params.cardId)) {
    card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      {
        new: true,
        runValidators: true,
      }
    )
      .then(cards => {
        if (cards) {
          res.send({ data: cards })
        } else {
          throw new NotFoundError('Данные не обновлены');
        }
      })
      .catch(next);
  } else {
    throw new IncorrectDataError('Переданы некорректные данные');
  }
};