const catchAsync = require('../utils/catchAsync');
const homeService = require('../services/home.service');

const getStats = catchAsync(async (req, res) => {
  const stats = await homeService.getStats(req.user.id);
  res.send(stats);
});

const getChartData = catchAsync(async (req, res) => {
  const chartData = await homeService.getChartData(req.user.id);
  res.send(chartData);
});

module.exports = {
  getStats,
  getChartData
};
