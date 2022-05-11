const Movie = require('../models/movies');
const { BadRequest } = require('../errors/badRequest');
const { Forbidden } = require('../errors/forbidden');
const { NotFound } = require('../errors/notFound');
const { Conflict } = require('../errors/conflict');

const getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные'),
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
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  const id = req.user._id;
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        next(
          new NotFound('Не найдено'),
        );
      } else if (movie.owner.toString() !== id) {
        next(
          new Forbidden('Нет прав'),
        );
      }
      Movie.findByIdAndDelete(req.params._id)
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные'),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllMovies, createMovie, deleteMovie,
};
