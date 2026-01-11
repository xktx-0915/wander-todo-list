const { pool } = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Task ID
 *         title:
 *           type: string
 *           description: Task title
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Task priority
 *         status:
 *           type: string
 *           enum: [Pending, In Progress, Completed]
 *           description: Task status
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Task due date
 *         categoryId:
 *           type: integer
 *           description: Category ID
 *         remark:
 *           type: string
 *           description: Task remark
 *         userId:
 *           type: integer
 *           description: User ID
 *       example:
 *         id: 1
 *         title: Book flight
 *         priority: High
 *         status: Pending
 *         dueDate: 2024-12-01
 *         categoryId: 1
 *         remark: Window seat
 *         userId: 1
 */

class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.priority = data.priority;
    this.status = data.status;
    this.dueDate = data.dueDate;
    this.categoryId = data.categoryId;
    this.remark = data.remark;
    this.userId = data.userId;
  }

  static async create({ title, priority, status, dueDate, categoryId, remark, userId }) {
    const [result] = await pool.execute(
      'INSERT INTO Tasks (title, priority, status, dueDate, categoryId, remark, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        title,
        priority || 'Medium',
        status || 'Pending',
        dueDate || null,
        categoryId || null,
        remark || null,
        userId
      ]
    );
    
    return new Task({
      id: result.insertId,
      title,
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate || null,
      categoryId: categoryId || null,
      remark: remark || null,
      userId
    });
  }

  static async findAllByUserId(userId, filters = {}, pagination = {}) {
    let baseQuery = 'FROM Tasks WHERE userId = ?';
    const params = [userId];

    if (filters.priority) {
      baseQuery += ' AND priority = ?';
      params.push(filters.priority);
    }
    if (filters.status) {
      baseQuery += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.dueDate) {
      baseQuery += ' AND DATE(dueDate) = ?';
      params.push(filters.dueDate);
    }
    if (filters.maxDueDate) {
      baseQuery += ' AND DATE(dueDate) <= ?';
      params.push(filters.maxDueDate);
    }
    if (filters.excludeStatus) {
      baseQuery += ' AND status != ?';
      params.push(filters.excludeStatus);
    }

    // Get total count
    const [countRows] = await pool.execute(`SELECT COUNT(*) as total ${baseQuery}`, params);
    const total = countRows[0].total;

    // Get data with pagination
    let query = `SELECT * ${baseQuery} ORDER BY status ASC, id DESC`;
    
    if (pagination.limit !== undefined && pagination.offset !== undefined) {
      query += ` LIMIT ${Number(pagination.limit)} OFFSET ${Number(pagination.offset)}`;
    }

    const [rows] = await pool.execute(query, params);
    
    return {
      total,
      list: rows.map(row => new Task(row))
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Tasks WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new Task(rows[0]);
  }

  static async update(id, { title, priority, status, dueDate, categoryId, remark }) {
    // Handle optional updates dynamically or just assume all fields are provided (or partial)
    // For simplicity, let's build the query dynamically
    const fields = [];
    const values = [];
    
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (dueDate !== undefined) { fields.push('dueDate = ?'); values.push(dueDate); }
    if (categoryId !== undefined) { fields.push('categoryId = ?'); values.push(categoryId); }
    if (remark !== undefined) { fields.push('remark = ?'); values.push(remark); }
    
    if (fields.length === 0) return this.findById(id);

    fields.push('updatedAt = NOW()');
    
    const query = `UPDATE Tasks SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await pool.execute(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM Tasks WHERE id = ?', [id]);
  }
}

module.exports = Task;
