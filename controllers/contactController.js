// controllers/contactController.js

const db = require('../config/db');
const { validationResult } = require('express-validator');

exports.getContact = (req, res) => {
    res.render('contact', { 
        title: 'Contacto',
        success: req.query.success,
        error: req.query.error,
        errors: req.flash('errors'),
        formData: req.flash('formData')[0] || {}
    });
};

exports.postContact = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('formData', req.body);
        return res.redirect('/contact');
    }

    const { name, email, message } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        req.flash('success', 'Tu mensaje ha sido enviado correctamente.');
        res.redirect('/contact');
    } catch (error) {
        console.error('Error al guardar el mensaje de contacto:', error);
        req.flash('error', 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.');
        res.redirect('/contact');
    }
};
