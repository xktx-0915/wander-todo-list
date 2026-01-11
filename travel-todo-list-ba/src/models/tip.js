const { pool } = require('../config/db');

class Tip {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }

    static async find() {
        try {
            const [rows] = await pool.query('SELECT * FROM tips');
            // 随机返回一个
            const randomIndex = Math.floor(Math.random() * rows.length);
            const randomTip = rows[randomIndex];
            return new Tip(randomTip.id, randomTip.content);
        } catch (error) {
            console.error('Error fetching tips:', error);
            throw error;
        }
    }
}
module.exports = Tip;
