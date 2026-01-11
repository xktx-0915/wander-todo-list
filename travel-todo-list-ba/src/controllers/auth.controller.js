const httpStatus = require('http-status').default || require('http-status');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');

const register = catchAsync(async (req, res) => {
  const user = await authService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(201).send({ user, token: tokens.access.token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, token: tokens.access.token });
});

module.exports = {
  register,
  login,
};
