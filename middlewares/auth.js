const jwt = require('jsonwebtoken');
const AuthenticationError = require('../errors/authentication-err');

module.exports = (req, res, next) => {
  const  token  = req.cookies.jwt;
  if (!token) {
    throw new AuthenticationError('Передан некорректный или отсутствующий токен');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'sekretka');
  } catch (err){
    throw new AuthenticationError('Необходима авторизация',err);
  }

  req.user = payload._id;
  next();
};