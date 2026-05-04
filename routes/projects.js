const express = require('express');
const router = express.Router();
const db = require('../db');

const requireLogin = (req, res, next) => {
    if (!req.session.userId) res.redirect('/sign_in');
    else next();
};

router.use(requireLogin);

// Index
router.get('/', (req, res) => {
    const projects = db.prepare(`
        SELECT projects.*, users.username as author_name 
        FROM projects 
        JOIN users ON projects.user_id = users.id
        ORDER BY projects.id DESC
    `).all();
    res.render('projects/index', { projects });
});

// New
router.get('/new', (req, res) => {
    res.render('projects/new');
});

// Create
router.post('/', (req, res) => {
    const { name, description } = req.body;
    const result = db.prepare('INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)').run(name, description, req.session.userId);
    res.redirect(`/projects/${result.lastInsertRowid}`);
});

// Show
router.get('/:id', (req, res) => {
    const project = db.prepare(`
        SELECT projects.*, users.username as author_name 
        FROM projects 
        JOIN users ON projects.user_id = users.id 
        WHERE projects.id = ?
    `).get(req.params.id);
    if (!project) return res.status(404).send('Not Found');
    res.render('projects/show', { project });
});

// Edit
router.get('/:id/edit', (req, res) => {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!project) return res.status(404).send('Not Found');
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    res.render('projects/edit', { project });
});

// Update
router.post('/:id/update', (req, res) => {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    
    const { name, description } = req.body;
    db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ?').run(name, description, req.params.id);
    res.redirect(`/projects/${req.params.id}`);
});

// Destroy
router.post('/:id/destroy', (req, res) => {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.redirect('/projects');
});

module.exports = router;
