//require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { Unauthorized } = require('./errors/unauthorized');
const { NotFound } = require('./errors/notFound');
const corsMiddleware = require('./middlewares/corsMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logMiddleware');
const urlPattern = require('./utils/regexp');

const { PORT = 3001 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`Сервер стартовал. Порт: ${PORT}`);
});

app.use(requestLogger);
app.use(corsMiddleware);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

mongoose.connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => console.log('Подключение к БД удалось'))
  .catch(() => console.log('Подключение к БД не удалось'));

mongoose.connection.on('open', () => console.log('Подключение к БД активно'));
mongoose.connection.on('error', () => console.log('Подключение к БД прервано'));

app.use(bodyParser.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5).max(30),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
      password: Joi.string().required().pattern(/^[A-Za-z0-9]{5,30}$/),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use(errors());

app.use('*', (req, res, next) => {
  if (!req.user) {
    return next(new Unauthorized('Неавторизовано'));
  }
  return next(new NotFound('Не найдено'));
});

app.use(errorLogger);

app.use(errorMiddleware);
