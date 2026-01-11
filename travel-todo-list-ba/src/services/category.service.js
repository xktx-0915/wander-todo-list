const Category = require('../models/category');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status').default || require('http-status');

const createCategory = async (categoryBody, userId) => {
  return Category.create({ ...categoryBody, userId });
};

const getCategories = async (userId) => {
  return Category.findAllByUserId(userId);
};

const getCategoryById = async (id, userId) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  if (category.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return category;
};

const updateCategoryById = async (id, updateBody, userId) => {
  const category = await getCategoryById(id, userId);
  Object.assign(category, updateBody);
  return Category.update(id, updateBody);
};

const deleteCategoryById = async (id, userId) => {
  const category = await getCategoryById(id, userId);
  await Category.delete(id);
  return category;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
