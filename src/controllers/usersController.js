const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const express = require("express");

// create new user
const createUser = async (req, res) => {
  try {
    const newUser = req.body;

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

const findUsers = async (req, res) => {
  const query = req.query.u;
  console.log(query);
  try {
    const foundUser = await prisma.users.findMany({
      select: {
        userId: true,
        username: true,
        email: true,
      },
      where: {
        OR: [
          {
            email: { contains: query },
          },
          {
            username: { contains: query },
          },
        ],
      },
    });

    if (foundUser.length === 0) {
      res.status(400).send("User does not exist");
    } else {
      res.json(foundUser);
    }
  } catch (e) {
    res.status(500).send(e);
  }
};

const findCollaborators = async () => {};

module.exports = { createUser, findUsers };
