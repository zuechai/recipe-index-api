const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger/logger");

// create new user
const createUser = async (req, res) => {
  logger.info("PUT createUser");
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
    logger.error(e);
    res.status(500).send(e);
  }
};

const findUsers = async (req, res) => {
  logger.info("GET findUsers");
  const query = req.query.u;
  logger.trace(query);
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

// const findCollaborators = async () => {};

module.exports = { createUser, findUsers };
