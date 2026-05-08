const Thread = require('../models/Thread');
const Project = require('../models/Project');
const User = require('../models/User');

const threadController = {
  new: async (req, res) => {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).send('Project Not Found');
    
    // Permission check: Only project admin can create
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    res.render('threads/new', { projectId: req.params.projectId });
  },

  create: async (req, res) => {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) return res.status(404).send('Project Not Found');

    // Permission check
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    const { title, content } = req.body;
    await Thread.create({
      title,
      content,
      project_id: req.params.projectId,
      user_id: req.session.userId
    });

    res.redirect(`/projects/${req.params.projectId}`);
  },

  edit: async (req, res) => {
    const thread = await Thread.findByPk(req.params.id, {
      include: [{ model: Project }]
    });
    if (!thread) return res.status(404).send('Thread Not Found');

    // Permission check: Project admin can edit
    if (thread.Project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    res.render('threads/edit', { thread: thread.get({ plain: true }) });
  },

  update: async (req, res) => {
    const thread = await Thread.findByPk(req.params.id, {
      include: [{ model: Project }]
    });
    if (!thread) return res.status(404).send('Thread Not Found');

    // Permission check
    if (thread.Project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    const { title, content } = req.body;
    await thread.update({ title, content });

    res.redirect(`/projects/${thread.project_id}`);
  },

  destroy: async (req, res) => {
    const thread = await Thread.findByPk(req.params.id, {
      include: [{ model: Project }]
    });
    if (!thread) return res.status(404).send('Thread Not Found');

    // Permission check
    if (thread.Project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    const projectId = thread.project_id;
    await thread.destroy();

    res.redirect(`/projects/${projectId}`);
  }
};

module.exports = threadController;
