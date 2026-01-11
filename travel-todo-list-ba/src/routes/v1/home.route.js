const express = require('express');
const auth = require('../../middlewares/auth');
const homeController = require('../../controllers/home.controller');

const router = express.Router();

router.get('/stats', auth, homeController.getStats);
router.get('/chart', auth, homeController.getChartData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Home page statistics and charts
 */

/**
 * @swagger
 * /home/stats:
 *   get:
 *     summary: Get task statistics
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 pending:
 *                   type: integer
 *                 inProgress:
 *                   type: integer
 *                 completed:
 *                   type: integer
 */

/**
 * @swagger
 * /home/chart:
 *   get:
 *     summary: Get chart data for last 7 days
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                   name:
 *                     type: string
 *                   new:
 *                     type: integer
 *                   completed:
 *                     type: integer
 */
