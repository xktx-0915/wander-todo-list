const jwt = require('jsonwebtoken');
const httpStatus = require('http-status').default || require('http-status');
const ApiError = require('../utils/ApiError');
const { pool } = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'thisisasamplesecret');

    const [rows] = await pool.execute('SELECT id, username, email, role FROM Users WHERE id = ?', [payload.sub]);
    if (rows.length === 0) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
};

module.exports = auth;
