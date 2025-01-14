// models/Cart.js
const pool = require('../config/db');

module.exports = {
  addToCart: async (userId, productId, quantity = 1) => {
    const [rows] = await pool.query(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    if (rows.length > 0) {
      const newQty = rows[0].quantity + quantity;
      await pool.query(
        `UPDATE cart SET quantity = ? WHERE id = ?`,
        [newQty, rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity)
         VALUES (?, ?, ?)`,
        [userId, productId, quantity]
      );
    }
  },

  getCartItems: async (userId) => {
    const [rows] = await pool.query(
      `SELECT c.*, p.name, p.description, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  },

  updateItem: async (cartId, quantity) => {
    await pool.query(
      `UPDATE cart SET quantity = ? WHERE id = ?`,
      [quantity, cartId]
    );
  },

  removeItem: async (cartId) => {
    await pool.query(`DELETE FROM cart WHERE id = ?`, [cartId]);
  },

  clearCart: async (userId) => {
    await pool.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);
  }
};
