// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.send('Debes iniciar sesión para hacer un pedido.');
  }
  next();
}

router.post('/create', isLoggedIn, orderController.createOrder);

router.get('/thankyou', orderController.thankYou);

module.exports = router;
