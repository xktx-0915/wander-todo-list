const express = require('express');
const authRoute = require('./auth.route');
const docsRoute = require('./docs.route');
const categoryRoute = require('./category.route');
const taskRoute = require('./task.route');
const homeRoute = require('./home.route');
const systemRoute = require("./system.route")

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/tasks',
    route: taskRoute,
  },
  {
    path: '/home',
    route: homeRoute,
  },
  {
    path: '/system',
    route: systemRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
