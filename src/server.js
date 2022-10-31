const express = require("express");
const cors = require("cors");
const app = express();
const { Sequelize } = require("sequelize");

require("dotenv").config();
app.use(express.json());
app.use(cors());

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

const Unit = require("./models/Unit")(sqlize);
const Ingredient = require("./models/Ingredient")(sqlize);
const User = require("./models/User")(sqlize);
const Recipe = require("./models/Recipe")(sqlize);
const IngredientList = require("./models/IngredientList")(sqlize);
const Method = require("./models/Method")(sqlize);
const Collaborator = require("./models/Collaborator")(sqlize);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
