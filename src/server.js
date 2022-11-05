// import
const express = require("express");
const cors = require("cors");
const app = express();
const { sqlize } = require("./utils/dbConnect");

// initialize
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/static", express.static("public"));

const alterSync = async () => {
  sqlize.sync();
};

alterSync();

// routes
const recipesRoute = require("./routes/recipesRoute");

app.use("/recipes", recipesRoute);

// run server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
