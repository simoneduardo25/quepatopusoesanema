// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const flash = require('connect-flash'); // Importar connect-flash

const { PORT, SESSION_SECRET } = process.env;

// Rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes'); // Importar contactRoutes

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash()); 

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.isAdmin = (req.session.user && req.session.user.role === 'admin');
  res.locals.success = req.flash('success').join('<br>'); 
  res.locals.error = req.flash('error').join('<br>');
  res.locals.errors = req.flash('errors');
  res.locals.formData = req.flash('formData')[0] || {};
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/', contactRoutes); // Usar contactRoutes

// Página principal
app.get('/', (req, res) => {
  res.render('home', { title: 'Inicio' });
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
