const cors = require('cors');
const Forbidden = require('../errors/forbidden');

const whitelist = [
  'http://localhost:3000',
  'http://myfilmsdb.cf',
  'https://myfilmsdb.cf',
  'http://www.myfilmsdb.cf',
  'https://www.myfilmsdb.cf'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Forbidden('Доступ запрещён'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);