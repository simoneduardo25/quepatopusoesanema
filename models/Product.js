// models/Product.js
const pool = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query(`SELECT * FROM products`);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [id]);
    return rows[0];
  },

  create: async (name, description, price, imageUrl) => {
    await pool.query(
      `INSERT INTO products (name, description, price, image_url)
       VALUES (?, ?, ?, ?)`,
      [name, description, price, imageUrl]
    );
  },

  update: async (id, name, description, price, imageUrl) => {
    await pool.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, image_url = ?
       WHERE id = ?`,
      [name, description, price, imageUrl, id]
    );
  },

  remove: async (id) => {
    await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
  }
};
