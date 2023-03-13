const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger/logger");

const { validateUsername, validateEmail } = require("../utils/validate");

/**
 * CREATE A NEW USER
 * @http PUT
 * @endpoint {baseUrl}/account
 * @param {*} req eventually will read in a token
 * @param {*} res
 */
const createUser = async (req, res, next) => {
  logger.info("PUT account/signup");
  try {
    // check for body
    if (Object.keys(req.body).length === 0) {
      throw { status: 400, message: "No request body provided" };
    }
    // check body contains required fields
    const keys = Object.keys(req.body);
    if (!keys.includes("firstName", "lastName", "username", "email")) {
      throw { status: 400, message: "Missing data in the request body" };
    }
    // validate username and email
    const newUser = req.body;
    if (!validateUsername(newUser.username)) {
      throw { status: 400, message: "Invalid username" };
    }
    if (!validateEmail(newUser.email)) {
      throw { status: 400, message: "Invalid email" };
    }
    // check if username is available
    const foundUser = await prisma.users.findUnique({
      where: { username: newUser.username },
    });
    if (foundUser) {
      throw { status: 400, message: "User already exist" };
    }
    // insert user into database
    newUser.userId = uuidv4();
    const created = await prisma.users.create({
      data: newUser,
    });
    // check for a successful submission
    if (!created) {
      throw { status: 500, message: "Error creating user" };
    }
    // return the newly created user
    res.json(created);
  } catch (error) {
    next(error);
  }
};

/**
 * GET THE CURRENT USER
 * @http GET
 * @endpoint {baseUrl}/users?byId=<userId>
 * @param {*} req.query.byId
 * @param {*} res
 */
const getUser = async (req, res, next) => {
  logger.info("GET /account");
  try {
    const { userId } = req.body;
    if (!userId) {
      throw { status: 401, message: "Missing data in request body" };
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
      throw { status: 404, message: "Does not exist" };
    }
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE THE CURRENT LOGGED-IN USER
 * @http DELETE
 * @endpoint {baseUrl}/account/delete
 * @param {*} req
 * @param {*} res
 * @returns
 */
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
