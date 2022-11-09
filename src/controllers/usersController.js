const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
// app.use("/static", express.static("public"));

// create new user
const createUser = async (req, res) => {
  const newUser = {
    userId: uuidv4(),
    firstName: "Mollie",
    lastName: "Mayfield",
    username: "mollieMay",
    email: "mollie.mayfield@gmail.com",
  };
  try {
    const foundUser = await prisma.users.findUnique({
      where: { username: newUser.username },
    });

    if (!foundUser) {
      const created = await prisma.users.create({
        data: {
          ...newUser,
        },
      });
      res.json(created);
    }
    res.status(400).send({ message: "User already exist." });
  } catch (e) {
    console.log(`Error =====>\n${e}`);
    res.status(500).send(e);
  }
};

const findUser = async (req, res) => {
  const query = req.query.u;
  // try {
  const foundUser = await prisma.users.findMany({
    where: {
      OR: {
        email: { contains: query },

        username: { contains: query },
      },
    },
  });

  if (!foundUser) {
    res.status(400).send("User does not exist");
  }

  res.json(foundUser);
  // } catch (e) {
  //   res.status(500).send({ error: e });
  // }
};

// retrieves logged in user from db

module.exports = { createUser, findUser };
