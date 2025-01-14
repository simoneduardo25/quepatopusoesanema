// models/OrderItem.js
const pool = require('../config/db');

module.exports = {
  createOrderItem: async (orderId, productId, quantity, price) => {
    const [result] = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [orderId, productId, quantity, price]
    );
    return result.insertId;
  },

  getItemsByOrder: async (orderId) => {
    const [rows] = await pool.query(`
      SELECT oi.*,
             p.name AS product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
    return rows;
  }
};
