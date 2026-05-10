const Message = require('../models/Message');
const Thread = require('../models/Thread');
const Project = require('../models/Project');

const messageController = {
  create: async (req, res) => {
    const thread = await Thread.findByPk(req.params.threadId);
    if (!thread) return res.status(404).send('Thread Not Found');

    const { content } = req.body;
    if (!content) return res.redirect('back');

    await Message.create({
      content,
      thread_id: req.params.threadId,
      user_id: req.session.userId
    });

    res.redirect(`/threads/${req.params.threadId}`);
  },

  edit: async (req, res) => {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).send('Message Not Found');

    // Permission check: Only author or admin
    if (message.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    res.render('messages/edit', { message: message.get({ plain: true }) });
  },

  update: async (req, res) => {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).send('Message Not Found');

    // Permission check
    if (message.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    const { content } = req.body;
    await message.update({ content });

    res.redirect(`/threads/${message.thread_id}`);
  },

  destroy: async (req, res) => {
    const message = await Message.findByPk(req.params.id);
    if (!message) return res.status(404).send('Message Not Found');

    // Permission check
    if (message.user_id !== req.session.userId && !res.locals.currentUser.is_admin) {
      return res.status(403).send('Forbidden');
    }

    const threadId = message.thread_id;
    await message.destroy();

    res.redirect(`/threads/${threadId}`);
  }
};

module.exports = messageController;
