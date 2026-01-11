import request from '../utils/request';

export const getStats = () => {
  return request({
    url: '/home/stats',
    method: 'get'
  });
};

export const getChartData = () => {
  return request({
    url: '/home/chart',
    method: 'get'
  });
};
