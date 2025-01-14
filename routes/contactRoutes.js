// routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');

router.get('/contact', contactController.getContact);

router.post('/contact', [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es requerido.')
        .isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres.'),
    body('email')
        .trim()
        .notEmpty().withMessage('El email es requerido.')
        .isEmail().withMessage('Por favor, introduce un email válido.')
        .normalizeEmail(),
    body('message')
        .trim()
        .notEmpty().withMessage('El mensaje es requerido.')
        .isLength({ max: 500 }).withMessage('El mensaje no debe exceder los 500 caracteres.')
], contactController.postContact);

module.exports = router;
