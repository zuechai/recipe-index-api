const express = require("express");
const cors = require("cors");
const app = express();
const { sqlize } = require("./utils/dbConnect");

require("dotenv").config();
app.use(express.json());
app.use(cors());

// // SEQUELIZE AND DATA MODEL IMPORTS
// const sqlize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: "localhost",
//     dialect: "mysql",
//   }
// );

const recipesRoute = require("./routes/recipesRoute");
app.use("/recipes", recipesRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
