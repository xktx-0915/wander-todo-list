const Task = require('../models/task');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status').default || require('http-status');

const createTask = async (taskBody, userId) => {
  return Task.create({ ...taskBody, userId });
};

const getTasks = async (userId, filters, pagination) => {
  return Task.findAllByUserId(userId, filters, pagination);
};

const getTaskById = async (id, userId) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  if (task.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return task;
};

const updateTaskById = async (id, updateBody, userId) => {
  const task = await getTaskById(id, userId);
  Object.assign(task, updateBody);
  return Task.update(id, updateBody);
};

const deleteTaskById = async (id, userId) => {
  const task = await getTaskById(id, userId);
  await Task.delete(id);
  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
