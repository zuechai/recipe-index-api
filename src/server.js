// import
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const cookieParser = require("cookie-parser");
const prisma = require("./prisma");
const logger = require("./utils/logger/logger");

// initialize
require("dotenv").config();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/static", express.static("public"));

// passport
app.use(
  session({
    cookie: { secure: true },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // checks every 10 minutes,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

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
