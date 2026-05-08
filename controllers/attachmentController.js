const fs = require('fs');
const path = require('path');
const Attachment = require('../models/Attachment');
const Project = require('../models/Project');

const attachmentController = {
  create: async (req, res) => {
    try {
      const projectId = req.params.id;
      const project = await Project.findByPk(projectId);
      
      if (!project) {
        return res.status(404).send('Project Not Found');
      }

      if (!req.file) {
        return res.status(400).send('No file uploaded or invalid file format.');
      }

      // Check format
      const validFormats = ['png', 'jpg', 'jpeg', 'pdf', 'txt'];
      const format = req.file.originalname.split('.').pop().toLowerCase();
      
      if (!validFormats.includes(format)) {
        // Remove uploaded file if format is invalid (though multer filter should catch this)
        fs.unlinkSync(req.file.path);
        return res.status(400).send('Invalid file format. Only png, jpg, pdf, and txt are allowed.');
      }

      const file_path = `/uploads/attachments/${req.file.filename}`;

      await Attachment.create({
        filename: req.file.originalname,
        file_path: file_path,
        format: format === 'jpeg' ? 'jpg' : format,
        project_id: project.id,
        user_id: req.session.userId
      });

      res.redirect(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  },

  destroy: async (req, res) => {
    try {
      const { id, attachment_id } = req.params;
      const attachment = await Attachment.findByPk(attachment_id);
      
      if (!attachment) {
        return res.status(404).send('Attachment Not Found');
      }

      // Permissions: uploader, project author, or admin
      const project = await Project.findByPk(id);
      const isUploader = attachment.user_id === req.session.userId;
      const isProjectAuthor = project && project.user_id === req.session.userId;
      const isAdmin = res.locals.currentUser && res.locals.currentUser.is_admin;

      if (!isUploader && !isProjectAuthor && !isAdmin) {
        return res.status(403).send('Forbidden');
      }

      // Remove file from disk
      const fullPath = path.join(__dirname, '..', 'public', attachment.file_path);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      await attachment.destroy();
      res.redirect(`/projects/${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
};

module.exports = attachmentController;
