// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.send('Debes iniciar sesión para acceder al carrito.');
  }
  next();
}

router.get('/', isLoggedIn, cartController.showCart);
router.post('/add', isLoggedIn, cartController.addItem);
router.post('/update', isLoggedIn, cartController.updateItem);
router.get('/remove/:id', isLoggedIn, cartController.removeItem);

module.exports = router;
