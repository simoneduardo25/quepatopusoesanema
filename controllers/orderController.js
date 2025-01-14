// controllers/orderController.js
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

module.exports = {
  createOrder: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const items = await Cart.getCartItems(userId);

      if (items.length === 0) {
        return res.render('cart/cart', {
          items: [],
          total: 0,
          error: 'No tienes productos en el carrito.'
        });
      }

      let total = 0;
      items.forEach(item => {
        total += item.price * item.quantity;
      });

      const orderId = await Order.createOrder(userId, total);

      for (const it of items) {
        await OrderItem.createOrderItem(orderId, it.product_id, it.quantity, it.price);
      }

      await Cart.clearCart(userId);

      return res.render('cart/cart', {
        items: [],
        total: 0,
        success: '¡Gracias por tu compra! Pronto te contactaremos.'
      });

    } catch (error) {
      console.error(error);
      return res.render('cart/cart', {
        items: [],
        total: 0,
        error: 'Ocurrió un error al crear tu pedido.'
      });
    }
  },

  thankYou: (req, res) => {
    return res.send('¡Gracias por tu compra! Pronto te contactaremos.');
  },

  //PARTE ADMIN

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.getAllOrders(); 
      res.render('admin/orders', { title: 'Listado de Pedidos', orders });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error al obtener pedidos.');
      res.redirect('/admin');
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params; 
      const { newStatus } = req.body; 
      await Order.updateStatus(id, newStatus);
      req.flash('success', 'Estado del pedido actualizado');
      res.redirect('/admin/orders');
    } catch (error) {
      console.error(error);
      req.flash('error', 'No se pudo actualizar el estado del pedido.');
      res.redirect('/admin/orders');
    }
  },

  getOrderDetail: async (req, res) => {
    try {
      const { id } = req.params; 
      const order = await Order.getById(id);
      const items = await OrderItem.getItemsByOrder(id);

      res.render('admin/orderDetail', {
        title: 'Detalle del Pedido',
        order,
        items
      });
    } catch (error) {
      console.error(error);
      req.flash('error', 'Error al obtener detalle del pedido.');
      res.redirect('/admin/orders');
    }
  }
};
