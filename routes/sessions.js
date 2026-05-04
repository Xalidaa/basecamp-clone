const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Sign In Form View
router.get('/sign_in', (req, res) => {
    if (req.session.userId) return res.redirect('/projects');
    res.render('sessions/new');
});

// Sign In Validation
router.post('/sign_in', async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (user && await bcrypt.compare(password, user.password_hash)) {
        req.session.userId = user.id;
        res.redirect('/projects');
    } else {
        res.render('sessions/new', { error: 'Invalid username or password.' });
    }
});

// Sign Out Process
router.post('/sign_out', (req, res) => {
    req.session.destroy();
    res.redirect('/sign_in');
});

module.exports = router;
