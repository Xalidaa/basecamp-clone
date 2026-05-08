const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const projectController = require('../controllers/projectController');
const attachmentController = require('../controllers/attachmentController');

// Set up Multer for attachments
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/attachments/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const validFormats = ['.png', '.jpg', '.jpeg', '.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (validFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format.'));
    }
  }
});

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

// Attachment routes
router.post('/:id/attachments', upload.single('attachment'), attachmentController.create);
router.post('/:id/attachments/:attachment_id/destroy', attachmentController.destroy);

module.exports = router;
