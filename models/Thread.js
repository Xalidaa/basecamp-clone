const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');
const Project = require('./Project');

const Thread = sequelize.define('Thread', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'threads',
  timestamps: true
});

// Relationships
Project.hasMany(Thread, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Thread.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(Thread, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Thread.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = Thread;
