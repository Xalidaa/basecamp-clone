const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) res.redirect('/sign_in');
    else next();
};

router.use(requireLogin);

router.get('/users', adminController.dashboard);
router.post('/users/:id/setAdmin', adminController.setAdmin);
router.post('/users/:id/removeAdmin', adminController.removeAdmin);
router.post('/users/:id/destroy', adminController.destroyUser);

module.exports = router;
