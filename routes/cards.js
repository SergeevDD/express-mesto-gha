const router = require('express').Router();
const { getCards, createCard, deleteCard, addLike, removeLike } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);
router.delete('/:cardId', deleteCard);


module.exports = router;