// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.send('Debes iniciar sesión para ver tu perfil.');
  }
  next();
}

router.get('/profile', isLoggedIn, userController.showProfile);
router.post('/profile', isLoggedIn, userController.updateProfile);

router.get('/orders', isLoggedIn, userController.getMyOrders);

router.get('/orders/:id', isLoggedIn, userController.getOrderDetail);

router.post('/orders/:id/received', isLoggedIn, userController.markOrderReceived);

module.exports = router;
