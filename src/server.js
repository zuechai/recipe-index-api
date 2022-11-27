// import
const express = require("express");
const cors = require("cors");
const app = express();

// initialize
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/static", express.static("public"));

// routes
const recipesRoute = require("./routes/recipesRoute");
const usersRoute = require("./routes/usersRoute");
app.get("/", (_req, res) => {
  res.send("Welcome to Recipe Index API");
});
app.use("/recipes", recipesRoute);
app.use("/users", usersRoute);

// run server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
