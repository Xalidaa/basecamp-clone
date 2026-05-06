const bcrypt = require('bcryptjs');
const User = require('../models/User');

const userController = {
  new: (req, res) => {
    if (req.session.userId) return res.redirect('/projects');
    res.render('users/new');
  },

  create: async (req, res) => {
    const { username, password, is_admin } = req.body;
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ 
          username, 
          password_hash: hash, 
          is_admin: is_admin === 'true'
      });
      // Auto-login after registration
      req.session.userId = user.id;
      res.redirect('/projects');
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.render('users/new', { error: 'Username already taken. Please choose another.' });
      } else {
        console.error(err);
        res.render('users/new', { error: 'An unexpected error occurred.' });
      }
    }
  },

  show: async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'is_admin']
    });
    if (!user) return res.status(404).send('User not found');
    res.render('users/show', { user });
  },

  destroy: async (req, res) => {
    const targetUserId = parseInt(req.params.id, 10);
    if (req.session.userId !== targetUserId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }
    await User.destroy({ where: { id: targetUserId } });
    if (req.session.userId === targetUserId) {
      req.session.destroy();
      res.redirect('/sign_in');
    } else {
      res.redirect('/projects');
    }
  }
};

module.exports = userController;
