const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// Ensure user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.userId) res.redirect('/sign_in');
    else next();
};

// GET Registration Form
router.get('/new', (req, res) => {
    if (req.session.userId) return res.redirect('/projects');
    res.render('users/new');
});

// POST Create User
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
        const result = stmt.run(username, hash);
        // Auto-login after registration
        req.session.userId = result.lastInsertRowid;
        res.redirect('/projects');
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.render('users/new', { error: 'Username already taken. Please choose another.' });
        } else {
            console.error(err);
            res.render('users/new', { error: 'An unexpected error occurred.' });
        }
    }
});

// GET User Profile (#show)
router.get('/:id', requireLogin, (req, res) => {
    const user = db.prepare('SELECT id, username, is_admin FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('users/show', { user });
});

// POST Delete User (#destroy)
router.post('/:id/destroy', requireLogin, (req, res) => {
    const targetUserId = parseInt(req.params.id, 10);
    if (req.session.userId !== targetUserId && !res.locals.currentUser.is_admin) {
        return res.status(403).send('Forbidden');
    }
    db.prepare('DELETE FROM users WHERE id = ?').run(targetUserId);
    if (req.session.userId === targetUserId) {
        req.session.destroy();
        res.redirect('/sign_in');
    } else {
        res.redirect('/projects');
    }
});

// POST Set Admin
router.post('/:id/setAdmin', requireLogin, (req, res) => {
    if (!res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    db.prepare('UPDATE users SET is_admin = 1 WHERE id = ?').run(req.params.id);
    res.redirect(`/users/${req.params.id}`);
});

// POST Remove Admin
router.post('/:id/removeAdmin', requireLogin, (req, res) => {
    if (!res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    db.prepare('UPDATE users SET is_admin = 0 WHERE id = ?').run(req.params.id);
    res.redirect(`/users/${req.params.id}`);
});

module.exports = router;
