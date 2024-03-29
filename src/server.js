// import
const express = require("express");
const cors = require("cors");
const app = express();
const logger = require("./utils/logger/logger");

// initialize
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use("/static", express.static("public"));

app.get("/", (_req, res) => {
  res.json("Welcome to Recipe Index API");
});

// routes
const recipesRoute = require("./routes/recipesRoute");
const accountRoute = require("./routes/accountRoute");
const usersRoute = require("./routes/usersRoute");
const errorHandler = require("./middleware/errorHandler");

app.use("/recipes", recipesRoute);
app.use("/account", accountRoute);
app.use("/users", usersRoute);

// error handler
app.use(errorHandler);

// run server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});
