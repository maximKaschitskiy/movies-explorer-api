const router = require('express').Router();
const { NotFound } = require('../errors/notFound');

router.use('*', (req, res, next) => {
  return next(new NotFound('Не найдено'));
});

module.exports = router;