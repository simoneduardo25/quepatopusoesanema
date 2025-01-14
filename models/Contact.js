// models/Contact.js

const db = require('../config/db');

class Contact {
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.error('Error al obtener mensajes de contacto:', error);
            throw error;
        }
    }

    static async create(name, email, message) {
        try {
            const [result] = await db.query(
                'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
                [name, email, message]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error al crear mensaje de contacto:', error);
            throw error;
        }
    }

    static async deleteById(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM contacts WHERE id = ?',
                [id]
            );
            return result.affectedRows;
        } catch (error) {
            console.error('Error al eliminar mensaje de contacto:', error);
            throw error;
        }
    }
}

module.exports = Contact;
