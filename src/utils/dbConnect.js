const { Sequelize } = require("sequelize");
require("dotenv").config();

// SEQUELIZE AND DATA MODEL IMPORTS
const sqlize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = { sqlize };
