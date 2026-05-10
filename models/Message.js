const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');
const Thread = require('./Thread');

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'messages',
  timestamps: true
});

// Relationships
Thread.hasMany(Message, { foreignKey: 'thread_id', onDelete: 'CASCADE' });
Message.belongsTo(Thread, { foreignKey: 'thread_id' });

User.hasMany(Message, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = Message;
