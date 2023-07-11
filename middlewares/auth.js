const jwt = require('jsonwebtoken');


const extractBearerToken = (header) => {
  return header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Передан некорректный или отсутствующий токен');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'sekretka');
  } catch (e){
    throw new AuthenticationError('Необходима авторизация');
  }
  req.user = payload;
  next();
};