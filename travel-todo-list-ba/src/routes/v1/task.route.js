const express = require('express');
const auth = require('../../middlewares/auth');
const taskController = require('../../controllers/task.controller');

const router = express.Router();

router
  .route('/')
  .post(auth, taskController.createTask)
  .get(auth, taskController.getTasks);

router
  .route('/:taskId')
  .get(auth, taskController.getTask)
  .patch(auth, taskController.updateTask)
  .delete(auth, taskController.deleteTask);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               categoryId:
 *                 type: integer
 *               remark:
 *                 type: string
 *             example:
 *               title: Buy groceries
 *               priority: Medium
 *               status: Pending
 *               dueDate: 2024-01-01
 *               categoryId: 1
 *               remark: Don't forget milk
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Task priority
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *         description: Task status
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               categoryId:
 *                 type: integer
 *               remark:
 *                 type: string
 *             example:
 *               title: Buy groceries
 *               priority: High
 *               status: In Progress
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       "204":
 *         description: No content
 */
