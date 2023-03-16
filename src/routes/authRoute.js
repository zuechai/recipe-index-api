const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const logger = require("../utils/logger/logger");
const router = express.Router();

const saltRounds = 10;

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

module.exports = router;
