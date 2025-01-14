// controllers/cartController.js
const Cart = require('../models/Cart');

module.exports = {
  showCart: async (req, res) => {
    try {
      const items = await Cart.getCartItems(req.session.user.id);
      let total = 0;
      items.forEach(item => {
        total += item.price * item.quantity;
      });

      const success = req.query.success || '';
      const error = req.query.error || '';

      res.render('cart/cart', { items, total, success, error });
    } catch (error) {
      console.error(error);
      res.redirect('/cart?error=Ocurrió un error al mostrar el carrito');
    }
  },

  addItem: async (req, res) => {
    try {
      const { productId } = req.body;
      await Cart.addToCart(req.session.user.id, productId, 1);
      res.redirect('/cart?success=Producto agregado al carrito');
    } catch (error) {
      console.error(error);
      res.redirect('/cart?error=Error al agregar el producto al carrito');
    }
  },

  updateItem: async (req, res) => {
    try {
      const { cartId, quantity } = req.body;
      await Cart.updateItem(cartId, parseInt(quantity));
      res.redirect('/cart?success=Cantidad actualizada');
    } catch (error) {
      console.error(error);
      res.redirect('/cart?error=Error al actualizar el carrito');
    }
  },

  removeItem: async (req, res) => {
    try {
      await Cart.removeItem(req.params.id);
      res.redirect('/cart?success=Producto eliminado');
    } catch (error) {
      console.error(error);
      res.redirect('/cart?error=Error al eliminar el producto del carrito');
    }
  }
};
