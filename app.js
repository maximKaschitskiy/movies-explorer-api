require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const router = require('./routes/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');
const corsMiddleware = require('./middlewares/corsMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logMiddleware');
const { errors } = require('celebrate');
const apiLimiter = require('./utils/rateLimiter');
const { PORT, DB_MODE } = require('./utils/config');

const app = express();

app.use(helmet());

app.use(requestLogger);

app.use(apiLimiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

mongoose.connect(DB_MODE)
  .then(() => console.log('Подключение к БД удалось'))
  .catch(() => console.log('Подключение к БД не удалось'));

mongoose.connection.on('open', () => console.log('Подключение к БД активно'));
mongoose.connection.on('error', () => console.log('Подключение к БД прервано'));

app.use(bodyParser.json());

app.use(corsMiddleware);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер стартовал. Порт: ${PORT}. База: ${DB_MODE}. Mode: ${process.env.NODE_ENV}`);
});