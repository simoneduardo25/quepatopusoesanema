// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/admin/login');
  }
  next();
}

router.get('/', isAdmin, (req, res) => {
  res.render('admin/dashboard', { title: 'Panel Admin' });
});

router.get('/products', isAdmin, async (req, res) => {
  try {
    const products = await Product.getAll();
    res.render('admin/products', { title: 'Gestionar Productos', products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.redirect('/admin');
  }
});

router.get('/orders', isAdmin, orderController.getAllOrders);
router.post('/orders/:id/status', isAdmin, orderController.updateOrderStatus);
router.get('/orders/:id', isAdmin, orderController.getOrderDetail);

router.get('/messages', isAdmin, adminController.getMessages);

router.delete('/messages/:id', isAdmin, adminController.deleteMessage);

module.exports = router;
