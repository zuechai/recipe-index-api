const express = require("express");
const cors = require("cors");
const app = express();
const { sqlize } = require("./utils/dbConnect");

const initModels = require("./models/init-models");
const recipesRoute = require("./routes/recipesRoute");

require("dotenv").config();
app.use(express.json());
app.use(cors());

app.use("/recipes", recipesRoute);

initModels(sqlize);

sqlize.sync({ force: true });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
