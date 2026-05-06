const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/sign_in', sessionController.new);
router.post('/sign_in', sessionController.create);
router.post('/sign_out', sessionController.destroy);

module.exports = router;
