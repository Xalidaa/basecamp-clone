const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) res.redirect('/sign_in');
    else next();
};

router.get('/new', userController.new);
router.post('/', userController.create);
router.get('/:id', requireLogin, userController.show);
router.post('/:id/destroy', requireLogin, userController.destroy);

module.exports = router;
