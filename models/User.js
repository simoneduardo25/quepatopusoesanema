// models/User.js
const pool = require('../config/db');

module.exports = {
  createUser: async (email, hashedPassword) => {
    const [result] = await pool.query(
      `INSERT INTO users (email, password) VALUES (?, ?)`,
      [email, hashedPassword]
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
  },

  updateProfile: async (id, first_name, last_name, address, phone) => {
    await pool.query(
      `UPDATE users
       SET first_name = ?, last_name = ?, address = ?, phone = ?
       WHERE id = ?`,
      [first_name, last_name, address, phone, id]
    );
  }
};
