const card = require('../models/card');
const ObjectId = require('mongoose').Types.ObjectId;
const NotFoundError = require('../errors/not-found-err');
const AccessError = require('../errors/access-err');

module.exports.createCard = (req, res, next) => {

  const {
    name,
    link,
    owner = req.user,
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
        throw new NotFoundError('Не удалось создать карточку');
      }
      res.send(card)
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  card.find({})
    .populate('owner')
    .then(cards => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
      res.send({ data: cards })
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .then((dbCard) => {
      if (!dbCard) {
        throw new NotFoundError('Карта не надена');
      }
      if (dbCard.owner.toString() !== req.user) {
        throw new AccessError('Нет прав на удаление');
      }
      return card.deleteOne({ _id: dbCard._id })
        .then((c) => {
          if (c.deletedCount === 1) {
            return dbCard
          }
        })
        .then((removedCard) => res.send({ data: removedCard }))
    })
    .catch(next)
};

module.exports.addLike = (req, res, next) => {
  card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user } },
  )
    .then(cards => {
      if (cards) {
        res.send({ data: cards })
      } else {
        if (!cards) {
          throw new NotFoundError(`Данные не обновлены, карточка с id:${req.params.cardId} отсутствует`);
        }
      }
    })
    .catch(next);
};

module.exports.removeLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user } },
  )
    .then(cards => {
      if (cards) {
        res.send({ data: cards })
      } else {
        throw new NotFoundError(`Данные не обновлены, карточка с id:${req.params.cardId} отсутствует`);
      }
    })
    .catch(next);
};