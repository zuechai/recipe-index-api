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
      return;
    }
    newUser.userId = uuidv4();
    const created = await prisma.users.create({
      data: newUser,
    });
    if (!created) {
      res.status(500).send({ message: "Could not create user" });
      return;
    }
    res.json(created);
  } catch (err) {
    logger.error("Caught in createUser");
    res.status(500).send({ message: "Error creating user", error: err });
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
      return;
    }
    const foundUser = await prisma.users.findUnique({
      where: { userId },
      select: {
        userId: true,
        username: true,
        email: true,
      },
    });
    if (!foundUser) {
      res.status(404).send("Does not exist");
      return;
    }
    res.json(foundUser);
  } catch (err) {
    logger.error(new Error(`Caught in getUser(), ${err}`));
    res.status(500).send({ message: "Caught in getUser()", error: err });
  }
};

// Update a User
const updateUser = async (req, res) => {
  logger.info("PATCH /account/update");
  try {
    if (!Object.keys(req.body).length) {
      res.status(400).send({ message: "No request body provided" });
      return;
    }
    const { userId, ...data } = req.body;
    const updatedUser = await prisma.users.update({
      where: { userId },
      data: data,
    });

    if (!updatedUser) {
      res.status(400).send({ message: "Error updating user" });
      return;
    }

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
    if (!req.query.userId) {
      res.status(400).send({ message: "No ID provided" });
    }
    const { userId } = req.query;
    const deletedUser = await prisma.users.delete({
      where: { userId },
    });
    if (!deletedUser) {
      logger.error(`${deletedUser}`);
      res.status(404).send({ message: "Error deleting the user" });
      return;
    }
    res.status(200).send(deletedUser);
  } catch (err) {
    logger.error("Caught in deleteUser()");
    res.status(500).send({ message: "Caught in deleteUser()", error: err });
  }
};

module.exports = { createUser, getUser, updateUser, deleteUser };
