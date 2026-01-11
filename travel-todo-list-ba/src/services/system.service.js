const Tip = require("../models/tip");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status').default || require('http-status');

const getTips = async () => {
    const tips = await Tip.find();
    return tips;
}

module.exports = {
    getTips,
}
