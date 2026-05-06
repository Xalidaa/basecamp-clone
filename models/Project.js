const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'projects',
  timestamps: false
});

// Relationships
User.hasMany(Project, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = Project;
