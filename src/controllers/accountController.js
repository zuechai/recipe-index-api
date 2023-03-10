const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger/logger");

/**
 * CREATE A NEW USER
 * @http PUT
 * @endpoint {baseUrl}/account
 * @param {*} req eventually will read in a token
 * @param {*} res
 */
const createUser = async (req, res) => {
  logger.info("PUT account/signup");
  try {
    const newUser = req.body;

    const foundUser = await prisma.users.findUnique({
      where: { username: newUser.username },
    });
    if (foundUser) {
      res.status(400).send({ message: "User already exist." });
    }

    newUser.userId = uuidv4();
    const created = await prisma.users.create({
      data: newUser,
    });
    res.json(created);
  } catch (e) {
    logger.error("Caught in createUser");
    res.status(500).send(e);
  }
};

/**
 * GET THE CURRENT USER
 * @http GET
 * @endpoint {baseUrl}/users?byId=<userId>
 * @param {*} req.query.byId
 * @param {*} res
 */
const getUser = async (req, res) => {
  logger.info("GET /account");
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(401).send({ message: "Missing data in request body" });
    }
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
    logger.error("Caught in getUser()");
    res.status(500).send({ message: "Caught in getUser()", error: err });
  }
};

// Update a User
const updateUser = async (req, res) => {
  logger.info("PATCH /account/update");
  try {
    // most likely want to use prisma.users.upsert
    res.json({ message: "Endpoint under construction" });
  } catch (err) {
    logger.error("Caught in updateUser()");
    res.status(500).send({ message: "Caught in updateUser()", error: err });
  }
};

/**
 * DELETE LOGGED-IN USER
 * @http DELETE
 * @endpoint {baseUrl}/account/delete
 * @param {*} req
 * @param {*} res
 */
const deleteUser = async (req, res) => {
  logger.info("DELETE /account/delete");
  try {
    if (!req.params.id) {
      res.status(400).send({ message: "No ID provided" });
    }
    const userId = req.params.id;
    const deletedUser = await prisma.users.delete({
      where: userId,
    });
    if (!deletedUser) {
      res.status(404).send({ message: "Record does not exist" });
    }
    res.status(200).send(deleteUser);
  } catch (err) {
    logger.error("Caught in deleteUser()");
    res.status(500).send({ message: "Caught in deleteUser()", error: err });
  }
};

module.exports = { createUser, getUser, updateUser, deleteUser };
