// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = {
  showLogin: (req, res) => {
    res.render('auth/login');
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.render('auth/login', {
          error: 'Usuario no encontrado. Verifica el correo electrónico.'
        });
      }
      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.render('auth/login', {
          error: 'Contraseña incorrecta.'
        });
      }
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return res.render('auth/login', {
        error: 'Ocurrió un error al iniciar sesión.'
      });
    }
  },

  showRegister: (req, res) => {
    res.render('auth/register');
  },

  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.render('auth/register', {
          error: 'Ese email ya está registrado.'
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await User.createUser(email, hashedPassword);

      return res.render('auth/login', {
        success: '¡Te registraste con éxito! Ahora inicia sesión.'
      });

    } catch (error) {
      console.error(error);
      return res.render('auth/register', {
        error: 'Ocurrió un error al registrarse.'
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  }
};
