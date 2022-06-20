const { PORT = 3001, NODE_ENV, JWT_SECRET, DATABASE_URL, } = process.env;

const JWT_MODE = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const DB_MODE = NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/moviesdb';

module.exports = {
  PORT, JWT_MODE, DB_MODE,
};