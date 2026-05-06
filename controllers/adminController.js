const User = require('../models/User');

const adminController = {
  dashboard: async (req, res) => {
    if (!res.locals.currentUser || !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }
    const users = await User.findAll({
      attributes: ['id', 'username', 'is_admin']
    });
    res.render('admin/dashboard', { users: users.map(u => u.get({ plain: true })) });
  },

  setAdmin: async (req, res) => {
    if (!res.locals.currentUser || !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }
    await User.update({ is_admin: true }, { where: { id: req.params.id } });
    res.redirect('/admin/users');
  },

  removeAdmin: async (req, res) => {
    if (!res.locals.currentUser || !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }
    // Optional: prevent user from removing their own admin status?
    await User.update({ is_admin: false }, { where: { id: req.params.id } });
    res.redirect('/admin/users');
  },

  destroyUser: async (req, res) => {
    if (!res.locals.currentUser || !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }
    await User.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/users');
  }
};

module.exports = adminController;
