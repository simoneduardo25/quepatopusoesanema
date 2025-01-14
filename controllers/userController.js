// controllers/userController.js
const User = require('../models/User');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

module.exports = {
  showProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id);

      const { success, error } = req.query;

      res.render('user/profile', { user, success, error });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al mostrar perfil.');
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { first_name, last_name, address, phone } = req.body;
      await User.updateProfile(req.session.user.id, first_name, last_name, address, phone);

      req.flash('success', 'Perfil actualizado correctamente');
      res.redirect('/user/profile');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error al actualizar el perfil');
      res.redirect('/user/profile');
    }
  },

  getMyOrders: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const orders = await Order.getOrdersByUserId(userId);

      const success = req.flash('success').join('<br>');
      const error = req.flash('error').join('<br>');

      res.render('user/myOrders', {
        title: 'Mis Pedidos',
        orders,
        success,
        error
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'No se pudieron obtener tus pedidos.');
      res.redirect('/user/profile');
    }
  },

  markOrderReceived: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const orderId = req.params.id;
      const order = await Order.getById(orderId);

      if (!order) {
        req.flash('error', 'Pedido no encontrado');
        return res.redirect('/user/orders');
      }

      if (order.user_id !== userId) {
        req.flash('error', 'No puedes marcar este pedido (no es tuyo).');
        return res.redirect('/user/orders');
      }

      await Order.updateStatus(orderId, 'delivered');
      req.flash('success', 'Pedido marcado como recibido');
      res.redirect('/user/orders');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Hubo un error al marcar el pedido');
      res.redirect('/user/orders');
    }
  },

  getOrderDetail: async (req, res) => {
    try {
      const orderId = req.params.id;
      const userId = req.session.user.id;

      const order = await Order.getById(orderId);
      if (!order) {
        req.flash('error', 'Pedido no encontrado.');
        return res.redirect('/user/orders');
      }

      if (order.user_id !== userId) {
        req.flash('error', 'No tienes permiso para ver este pedido.');
        return res.redirect('/user/orders');
      }

      const items = await OrderItem.getItemsByOrder(orderId);

      const success = req.flash('success').join('<br>');
      const error = req.flash('error').join('<br>');

      return res.render('user/orderDetail', {
        title: 'Detalle del Pedido',
        order,
        items,
        success,
        error
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error al obtener detalle del pedido.');
      return res.redirect('/user/orders');
    }
  }
};
