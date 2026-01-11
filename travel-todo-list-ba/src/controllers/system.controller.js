const httpStatus = require('http-status').default || require('http-status');
const catchAsync = require('../utils/catchAsync');
const systemService = require("../services/system.service");

const getTips = catchAsync(async (req, res) => {
    const tips = await systemService.getTips();
    res.send(tips);
})

module.exports = {
    getTips,
}