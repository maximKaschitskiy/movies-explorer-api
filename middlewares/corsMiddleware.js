const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const ALLOWED_CORS = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://84.201.141.78',
  'https://84.201.141.78',
  'http://wwww.hot-chicks.nomoredomains.work',
  'https://www.hot-chicks.nomoredomains.work',
  'http://hot-chicks.nomoredomains.work',
  'https://hot-chicks.nomoredomains.work',
];

module.exports = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const { origin } = req.headers;

  if (ALLOWED_CORS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }
  next();
};
