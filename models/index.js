require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('Connecting to PostgreSQL database...');
  // Use PostgreSQL if DATABASE_URL is provided (e.g., on Render/Heroku)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for many cloud DB providers
      }
    },
    logging: false
  });
} else {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: DATABASE_URL is not set in production environment!');
  }
  console.log('Connecting to local SQLite database...');
  // Fallback to SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'basecamp.db'),
    logging: false
  });
}

module.exports = sequelize;
