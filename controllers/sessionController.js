const bcrypt = require('bcryptjs');
const User = require('../models/User');

const sessionController = {
  new: (req, res) => {
    if (req.session.userId) return res.redirect('/projects');
    res.render('sessions/new');
  },

  create: async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.userId = user.id;
      res.redirect('/projects');
    } else {
      res.render('sessions/new', { error: 'Invalid username or password.' });
    }
  },

  destroy: (req, res) => {
    req.session.destroy();
    res.redirect('/sign_in');
  }
};

module.exports = sessionController;
