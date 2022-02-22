const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { BadRequest } = require('../errors/badRequest');
const { NotFound } = require('../errors/notFound');
const { Conflict } = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  User.create({
    name, email, password: hash,
  })
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Ошибка валидации'),
        );
      }
      if (err.code === 11000) {
        next(
          new Conflict('Пользователь существует'),
        );
      } else {
        next(err);
      }
    })
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(
          new NotFound('Пользователь не найден'),
        );
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      email: req.body.email,
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updUser) => {
      if (!updUser) {
        next(
          new NotFound('Пользователь не найден'),
        );
      }
      res.status(200).send(updUser);
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError': {
          next(
            new BadRequest('Переданы некорректные данные'),
          );
          break;
        }
        case 'CastError': {
          next(
            new BadRequest('Переданы некорректные данные'),
          );
          break;
        }
        case 'MongoError': {
          if (err.code === 11000) {
            next(
              new Conflict('Пользователь уже существует'),
            );
          }
          break;
        }
        case 'MongoServerError': {
          if (err.code === 11000) {
            next(
              new Conflict('Пользователь уже существует'),
            );
          }
          break;
        }
        default:
          next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(
      new BadRequest('Ошибка валидации'),
    );
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  createUser, getCurrentUserInfo, updateUser, login,
};
