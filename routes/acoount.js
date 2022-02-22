const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const {signinValidation, signupValidation} = require('../middlewares/validationMiddleware');

router.post('/signin', signinValidation, login);

router.post('/signup', signupValidation, createUser);

module.exports = router;