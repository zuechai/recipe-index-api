const prisma = require("../../prisma");

async function findUserWithId(id) {
  return await prisma.users.findUnique({
    where: {
      userId: id,
    },
  });
}

module.exports = { findUserWithId };
