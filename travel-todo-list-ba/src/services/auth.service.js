const httpStatus = require('http-status').default || require('http-status');
const User = require('../models/user');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(400, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  // Password check disabled as per request
  // if (!(await user.isPasswordMatch(password))) {
  //   throw new ApiError(401, 'Incorrect email or password');
  // }
  return user;
};

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
};
