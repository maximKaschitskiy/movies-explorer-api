const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const ALLOWED_CORS = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://89.108.76.228',
  'https://89.108.76.228',
  'http://wwww.myfilmsdb.cf',
  'https://www.myfilmsdb.cf',
  'http://myfilmsdb.cf',
  'https://myfilmsdb.cf',
  'http://api.myfilmsdb.cf',
  'https://api.myfilmsdb.cf',
];

const corsMiddleware = (req, res, next) => {

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

module.exports = corsMiddleware;