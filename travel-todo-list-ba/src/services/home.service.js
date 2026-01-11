const { pool } = require('../config/db');

const getStats = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
       SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress,
       SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
     FROM Tasks 
     WHERE userId = ?`,
    [userId]
  );
  
  // Ensure we return numbers, SUM can return null if no rows match but COUNT(*) handles 0. 
  // However, if there are no tasks, COUNT is 0, SUM is null.
  return {
    total: parseInt(rows[0].total || 0),
    pending: parseInt(rows[0].pending || 0),
    inProgress: parseInt(rows[0].inProgress || 0),
    completed: parseInt(rows[0].completed || 0)
  };
};

const getChartData = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  // Reset time to start of that day
  sevenDaysAgo.setHours(0, 0, 0, 0);
  const dateStr = sevenDaysAgo.toISOString().slice(0, 19).replace('T', ' ');

  // Get New Tasks
  const [newTasks] = await pool.execute(
    `SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') as date, COUNT(*) as count 
     FROM Tasks 
     WHERE userId = ? AND createdAt >= ? 
     GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')`,
    [userId, dateStr]
  );

  // Get Completed Tasks
  const [completedTasks] = await pool.execute(
    `SELECT DATE_FORMAT(updatedAt, '%Y-%m-%d') as date, COUNT(*) as count 
     FROM Tasks 
     WHERE userId = ? AND status = 'Completed' AND updatedAt >= ? 
     GROUP BY DATE_FORMAT(updatedAt, '%Y-%m-%d')`,
    [userId, dateStr]
  );

  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().split('T')[0];
    
    const newCount = newTasks.find(x => x.date === dayStr)?.count || 0;
    const completedCount = completedTasks.find(x => x.date === dayStr)?.count || 0;
    
    // Get day name (Mon, Tue, etc.)
    const dayName = d.toLocaleDateString('zh-CN', { weekday: 'short' });

    result.push({
      date: dayStr,
      name: dayName,
      new: newCount,
      completed: completedCount
    });
  }

  return result;
};

module.exports = {
  getStats,
  getChartData
};
