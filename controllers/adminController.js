// controllers/adminController.js
const db = require('../config/db');

exports.getMessages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    const messages = rows || [];
    const { success = '', error = '' } = req.query;

    res.render('admin/messages', {
      title: 'Mensajes de Contacto',
      messages,
      success,
      error
    });
  } catch (error) {
    console.error('Error al obtener los mensajes de contacto:', error);
    res.status(500).send('Error al obtener los mensajes de contacto.');
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const [result] = await db.query('DELETE FROM contacts WHERE id = ?', [messageId]);
    if (result.affectedRows > 0) {
      return res.redirect('/admin/messages?success=Mensaje eliminado correctamente');
    } else {
      return res.redirect('/admin/messages?error=No se encontró el mensaje a eliminar');
    }
  } catch (error) {
    console.error('Error al eliminar mensaje de contacto:', error);
    res.redirect('/admin/messages?error=Error al eliminar el mensaje');
  }
};
