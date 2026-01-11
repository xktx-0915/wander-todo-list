const jwt = require('jsonwebtoken');
const moment = require('moment');
require('dotenv').config();

const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES || 30, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, 'access');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
