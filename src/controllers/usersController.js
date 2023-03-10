const prisma = require("../prisma");
const logger = require("../utils/logger/logger");

/**
 * FIND ONE OR MORE USERS
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

module.exports = { findUsers };
