// models/Order.js
const pool = require('../config/db');

module.exports = {
  createOrder: async (userId, total) => {
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, total)
       VALUES (?, ?)`,
      [userId, total]
    );
    return result.insertId;
  },

  // Obtenemos todos los pedidos (para ADMIN) con JOIN a users
  getAllOrders: async () => {
    const [rows] = await pool.query(`
      SELECT 
        o.*,
        u.email,
        u.address,
        u.phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(
      `SELECT o.*, u.email, u.address, u.phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0];
  },

  // Actualizamos el estado del pedido
  updateStatus: async (orderId, status) => {
    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
  },

  getOrdersByUserId: async (userId) => {
    const [rows] = await pool.query(`
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [userId]);
    return rows;
  }
};
