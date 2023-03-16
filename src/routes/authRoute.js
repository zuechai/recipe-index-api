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
  const hashedPassword = await bcrypt.hash(
    password,
    saltRounds,
    async (error, hash) => {
      if (error) {
        throw error;
      }
      logger.trace(hash);
      return hash;
    }
  );
  res.json(hashedPassword);
});

module.exports = router;
