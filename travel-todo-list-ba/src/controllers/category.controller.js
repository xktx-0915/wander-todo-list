const httpStatus = require('http-status').default || require('http-status');
const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(category);
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories(req.user.id);
  res.send(categories);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId, req.user.id);
  res.send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body, req.user.id);
  res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
