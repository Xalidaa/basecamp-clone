const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Project = require('./Project');
const User = require('./User');

const Attachment = sequelize.define('Attachment', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'attachments',
  timestamps: true // Useful to know when it was uploaded
});

// Relationships
Project.hasMany(Attachment, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Attachment.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(Attachment, { foreignKey: 'user_id', onDelete: 'SET NULL' });
Attachment.belongsTo(User, { foreignKey: 'user_id', as: 'uploader' });

module.exports = Attachment;
