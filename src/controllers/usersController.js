const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger/logger");

/**
 * CREATE A NEW USER
 * @http PUT
 * @endpoint {baseUrl}/users
 * @param {*} req.body
 * @param {*} res
 */
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

/**
 * FIND A SINGLE USER
 * @http GET
 * @endpoint {baseUrl}/users?byId=<userId>
 * @param {*} req.query.byId
 * @param {*} res
 */
const findUser = async (req, res) => {
  logger.info("GET /users?byId=<userId>");
  try {
    if (!Object.keys(req.query).includes("byId")) {
      res.status(400).send({ message: "No query provided" });
    }
    const query = res.query.byId;
    const foundUser = await prisma.users.findUnique({
      where: { userId: query },
      select: {
        userId: true,
        username: true,
        email: true,
      },
    });
    if (!foundUser) {
      res.status(404).send("Does not exist");
    }
    res.json(foundUser);
  } catch (err) {
    res.status(500).send({ message: "Caught in findUsers()", error: err });
  }
};

/**
 * FIND MULTIPLE USERS
 * @http GET
 * @endpoint  {baseUrl}/users?byIds
 * @param {*} req.query.byIds
 * @param {*} res
 */
const findUsers = async (req, res) => {
  logger.info("GET findUsers");
  try {
    if (!Object.keys(req.query).includes("byIds")) {
      res.status(400).send({ message: "No query provided" });
    }
    const query = req.query.byIds;
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
      res.status(404).send("User does not exist");
    } else {
      res.json(foundUser);
    }
  } catch (err) {
    res.status(500).send({ message: "Caught in findUsers()", error: err });
  }
};

// Update a User

// Delete a User

module.exports = { createUser, findUser, findUsers };
