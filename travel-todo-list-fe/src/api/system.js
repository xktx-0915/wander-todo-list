import request from '../utils/request';

export const getTips = (params) => {
  return request({
    url: '/system/tips',
    method: 'get',
    params,
  });
};