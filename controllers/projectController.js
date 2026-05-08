const Project = require('../models/Project');
const User = require('../models/User');
const Attachment = require('../models/Attachment');

const projectController = {
  index: async (req, res) => {
    const projects = await Project.findAll({
      include: [{ model: User, as: 'author', attributes: ['username'] }],
      order: [['id', 'DESC']]
    });
    
    // Format projects to match the previous structure expected by the view
    const formattedProjects = projects.map(p => {
      const plain = p.get({ plain: true });
      plain.author_name = plain.author ? plain.author.username : 'Unknown';
      return plain;
    });

    res.render('projects/index', { projects: formattedProjects });
  },

  new: (req, res) => {
    res.render('projects/new');
  },

  create: async (req, res) => {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      user_id: req.session.userId
    });
    res.redirect(`/projects/${project.id}`);
  },

  show: async (req, res) => {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['username'] },
        { model: Attachment }
      ]
    });
    if (!project) return res.status(404).send('Not Found');

    const plainProject = project.get({ plain: true });
    plainProject.author_name = plainProject.author ? plainProject.author.username : 'Unknown';

    res.render('projects/show', { project: plainProject });
  },

  edit: async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not Found');
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    res.render('projects/edit', { project: project.get({ plain: true }) });
  },

  update: async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not Found');
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    
    const { name, description } = req.body;
    await project.update({ name, description });
    res.redirect(`/projects/${project.id}`);
  },

  destroy: async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).send('Not Found');
    if (project.user_id !== req.session.userId && !res.locals.currentUser.is_admin) return res.status(403).send('Forbidden');
    
    await project.destroy();
    res.redirect('/projects');
  }
};

module.exports = projectController;
