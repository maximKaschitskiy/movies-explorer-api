const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { Unauthorized } = require('../errors/unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let token = null;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Неверный токен'));
  }
  token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new Unauthorized('Неавторизовано'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
