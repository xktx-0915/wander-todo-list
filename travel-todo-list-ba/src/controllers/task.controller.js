const httpStatus = require('http-status').default || require('http-status');
const catchAsync = require('../utils/catchAsync');
const taskService = require('../services/task.service');

const createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(task);
});

const getTasks = catchAsync(async (req, res) => {
  const filters = {
    priority: req.query.priority,
    status: req.query.status,
    dueDate: req.query.dueDate,
    maxDueDate: req.query.maxDueDate,
    excludeStatus: req.query.excludeStatus,
  };
  
  const pageSize = parseInt(req.query.pageSize) || 10;
  const current = parseInt(req.query.current) || 1;
  const pagination = {
    limit: pageSize,
    offset: (current - 1) * pageSize
  };

  const result = await taskService.getTasks(req.user.id, filters, pagination);
  res.send(result);
});

const getTask = catchAsync(async (req, res) => {
  const task = await taskService.getTaskById(req.params.taskId, req.user.id);
  res.send(task);
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTaskById(req.params.taskId, req.body, req.user.id);
  res.send(task);
});

const deleteTask = catchAsync(async (req, res) => {
  await taskService.deleteTaskById(req.params.taskId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
