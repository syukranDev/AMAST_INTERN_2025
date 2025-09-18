'use strict'

const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      useUTC: true
    },
    pool: {
      max: 300,
      min: 10,
      idle: 600000
    },
    logging: false,
    alter: false
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// new table must declare here
db.products = require('./products.js')(sequelize, Sequelize);
db.webhook_3rd_party = require('./webhook_3rd_party.js')(sequelize, Sequelize);

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db;