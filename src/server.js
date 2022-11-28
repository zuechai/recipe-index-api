// import
const express = require("express");
const cors = require("cors");
const app = express();

// initialize
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/static", express.static("public"));

app.get("/", (_req, res) => {
  res.send("Welcome to Recipe Index API");
});

// routes
const recipesRoute = require("./routes/recipesRoute");
const usersRoute = require("./routes/usersRoute");

app.use("/recipes", recipesRoute);
app.use("/users", usersRoute);

// run server
const port = process.env.DB_PORT || 5050;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
