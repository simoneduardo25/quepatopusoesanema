// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.send('No tienes permisos de administrador.');
  }
  next();
}

router.get('/', productController.showAll);

router.get('/create', isAdmin, productController.showCreate);
router.post('/', isAdmin, upload.single('image'), productController.create);

router.get('/:id/edit', isAdmin, productController.showEdit);
router.put('/:id', isAdmin, upload.single('image'), productController.edit);

router.delete('/:id', isAdmin, productController.delete);

module.exports = router;
