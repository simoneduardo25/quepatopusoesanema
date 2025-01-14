// controllers/productController.js
const Product = require('../models/Product');

module.exports = {
  showAll: async (req, res) => {
    try {
      const products = await Product.getAll();
      res.render('products/index', { products });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener productos.');
    }
  },

  showCreate: (req, res) => {
    res.render('products/create');
  },

  create: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      
      let imageUrl = 'default.png';
      if (req.file) {
        imageUrl = req.file.filename;
      }

      await Product.create(name, description, price, imageUrl);
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear producto.');
    }
  },

  showEdit: async (req, res) => {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) return res.send('Producto no encontrado');
      res.render('products/edit', { product });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener producto.');
    }
  },

  edit: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      let imageUrl = req.body.oldImage || 'default.png';

      if (req.file) {
        imageUrl = req.file.filename;
      }

      await Product.update(req.params.id, name, description, price, imageUrl);
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al editar producto.');
    }
  },

  delete: async (req, res) => {
    try {
      await Product.remove(req.params.id);
      res.redirect('/products');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar producto.');
    }
  }
};
