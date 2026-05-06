const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) res.redirect('/sign_in');
    else next();
};

router.use(requireLogin);

router.get('/', projectController.index);
router.get('/new', projectController.new);
router.post('/', projectController.create);
router.get('/:id', projectController.show);
router.get('/:id/edit', projectController.edit);
router.post('/:id/update', projectController.update);
router.post('/:id/destroy', projectController.destroy);

module.exports = router;
