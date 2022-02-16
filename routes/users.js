const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlPattern = require('../utils/regexp');

const {
  getCurrentUserInfo, updateUser,
} = require('../controllers/users');

usersRouter.get('/users/me', getCurrentUserInfo);

usersRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

module.exports = usersRouter;
