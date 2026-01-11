import request from '../utils/request';

export const getTasks = (params) => {
  return request({
    url: '/tasks',
    method: 'get',
    params,
  });
};

export const createTask = (data) => {
  return request({
    url: '/tasks',
    method: 'post',
    data,
  });
};

export const getTaskById = (id) => {
  return request({
    url: `/tasks/${id}`,
    method: 'get',
  });
};

export const updateTask = (id, data) => {
  return request({
    url: `/tasks/${id}`,
    method: 'patch',
    data,
  });
};

export const deleteTask = (id) => {
  return request({
    url: `/tasks/${id}`,
    method: 'delete',
  });
};
