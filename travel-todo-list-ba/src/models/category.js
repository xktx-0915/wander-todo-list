const { pool } = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Category ID
 *         name:
 *           type: string
 *           description: Category name
 *         color:
 *           type: string
 *           description: Category color tag
 *         description:
 *           type: string
 *           description: Category description
 *         userId:
 *           type: integer
 *           description: User ID
 *       example:
 *         id: 1
 *         name: Travel
 *         color: blue
 *         description: Travel related tasks
 *         userId: 1
 */

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.description = data.description;
    this.userId = data.userId;
  }

  static async create({ name, color, description, userId }) {
    const [result] = await pool.execute(
      'INSERT INTO Categories (name, color, description, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, color || null, description || null, userId]
    );
    
    return new Category({
      id: result.insertId,
      name,
      color: color || null,
      description: description || null,
      userId
    });
  }

  static async findAllByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM Categories WHERE userId = ?', [userId]);
    return rows.map(row => new Category(row));
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM Categories WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return new Category(rows[0]);
  }

  static async update(id, { name, color, description }) {
    const fields = [];
    const values = [];
    
    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (color !== undefined) { fields.push('color = ?'); values.push(color); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    
    if (fields.length === 0) return this.findById(id);

    fields.push('updatedAt = NOW()');
    
    const query = `UPDATE Categories SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await pool.execute(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM Categories WHERE id = ?', [id]);
  }
}

module.exports = Category;
