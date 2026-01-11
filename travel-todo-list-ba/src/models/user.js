const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         username:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *       example:
 *         id: 1
 *         username: fake name
 *         email: fake@example.com
 *         role: user
 */
class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
  }

  static async create({ name, email, password, role = 'user' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // username maps to name in input usually, but model has username. 
    // Let's check auth.service.js usage. It passes userBody. 
    // auth.route.js validation says 'name'. 
    // Let's assume input has 'name' which maps to 'username'.
    
    const [result] = await pool.execute(
      'INSERT INTO Users (username, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, role]
    );
    
    return new User({
      id: result.insertId,
      username: name,
      email,
      password: hashedPassword,
      role
    });
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  static async isEmailTaken(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async isPasswordMatch(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
