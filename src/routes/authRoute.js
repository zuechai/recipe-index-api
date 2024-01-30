const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const logger = require("../utils/logger/logger");
const router = express.Router();

const saltRounds = process.env.SALT_ROUNDS;

router.get("/signup", async (req, res, next) => {
  const password = "password";
  const wrongPw = "wrong";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  let isCorrect = await bcrypt.compare(password, hashedPassword);
  logger.trace(isCorrect);
  isCorrect = await bcrypt.compare(wrongPw, hashedPassword);
  logger.trace(isCorrect);
  res.json("");
});

router.put("/login", async (req, res, next) => {
  logger.info("PUT /auth/login");
  try {
    if (Object.keys(req.body).length === 0) {
      throw { status: 400, message: "No request body" };
    }
    const { username, password } = req.body;
    if (username !== null && password !== null) {
      const foundUser = await prisma.users.findUnique({
        where: { username },
      });

      if (!foundUser) {
        throw { status: 400, message: "Invalid credentials" };
      }

      const isValidPassword = await bcrypt.compare(
        password,
        foundUser.hashedPw
      );

      if (!isValidPassword) {
        throw { status: 400, message: "Invalid credentials" };
      }

      req.session.loggedin = true;
      req.session.username = username;

      res.json("Logged in!");
    } else {
      res.status(400).send("No username or password found");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
