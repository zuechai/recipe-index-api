// import
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
// const passport = require("passport");
const session = require("express-session");
// const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const cookieParser = require("cookie-parser");
// const prisma = require("./prisma");
const logger = require("./utils/logger/logger");

// initialize
require("dotenv").config();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/static", express.static("public"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", (_req, res) => {
  res.json("Welcome to Recipe Index API");
});

// routes
const recipesRoute = require("./routes/recipesRoute");
const accountRoute = require("./routes/accountRoute");
const usersRoute = require("./routes/usersRoute");
const authRoute = require("./routes/authRoute");
const errorHandler = require("./middleware/errorHandler");

app.use("/recipes", recipesRoute);
app.use("/account", accountRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoute);

// error handler
app.use(errorHandler);

// run server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});
