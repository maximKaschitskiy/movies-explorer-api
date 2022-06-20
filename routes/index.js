const router = require('express').Router();

const auth = require('../middlewares/auth');

const account = require('./acoount');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFound = require('./notFound');

router.use(account);

router.use('/', auth, usersRouter);
router.use('/', auth, moviesRouter);

router.use(notFound);

module.exports = router;