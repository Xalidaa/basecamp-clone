const express = require('express');
const router = express.Router({ mergeParams: true });
const threadController = require('../controllers/threadController');
const messageController = require('../controllers/messageController');

// Routes nested under /projects/:projectId
router.get('/new', threadController.new);
router.post('/', threadController.create);

// Routes for specific threads
router.get('/:id', threadController.show);
router.get('/:id/edit', threadController.edit);
router.post('/:id', threadController.update); // Using POST for update to simplify form submission without method-override
router.post('/:id/delete', threadController.destroy); // Using POST for delete for the same reason

// Message routes (nested under threads)
router.post('/:threadId/messages', messageController.create);
router.get('/messages/:id/edit', messageController.edit);
router.post('/messages/:id', messageController.update);
router.post('/messages/:id/delete', messageController.destroy);

module.exports = router;
