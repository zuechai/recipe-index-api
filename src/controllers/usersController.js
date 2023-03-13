const prisma = require("../prisma");
const logger = require("../utils/logger/logger");

/**
 * FIND ONE OR MORE USERS
 * @http GET
 * @endpoint  {baseUrl}/users?byIds
 * @param {*} req.query.byIds
 * @param {*} res
 */
const findUsers = async (req, res, next) => {
  logger.info("GET /users?byTag");
  try {
    if (!Object.keys(req.query).includes("byTag")) {
      throw { status: 400, message: "No query provided" };
    }
    const query = req.query.byTag;
    if (!query || query.length < 4) {
      throw { status: 400, message: "Invalid query value provided" };
    }
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
      throw { status: 400, message: "User does not exist" };
    }
    res.json(foundUser);
  } catch (error) {
    next(error);
  }
};

module.exports = { findUsers };
