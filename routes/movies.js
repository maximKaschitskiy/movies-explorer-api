const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlPattern = require('../utils/regexp');

const {
  getAllMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/movies', getAllMovies);

moviesRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().uri().required(),
      trailerLink: Joi.string().uri().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().uri().required(),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);

moviesRouter.delete(
  '/movies/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = moviesRouter;
