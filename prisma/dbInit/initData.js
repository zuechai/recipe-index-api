const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../src/utils/logger/logger");

// Follow instructions in README.md to connect your database with Prisma, then run the following command in the terminal:
// node run initData.js
// Once you confirm the tables in your database have been filled, you can delete the folder dbInit

// ---------------------

// create users
async function createUsers() {
  try {
    const created = await prisma.users.create({
      data: {
        ...newUser,
      },
    });
    logger.info(created);
  } catch (e) {
    logger.error(e);
  }
}

createUsers();

// ---------------------

// create recipes adding the above users

async function createRecipes() {
  try {
    const { userId, title, image, ingredients, methods, collaborators } =
      req.body;

    const user = await prisma.users.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      res
        .status(404)
        .send(
          "User not found when creating recipe. Check database for user data."
        );
    }

    ingredients.forEach(({ measurement, ingredient }) => {
      const create = async () => {
        let ing = await prisma.ingredients.findUnique({
          where: { ingredient: ingredient },
          select: {
            ingredientId: true,
          },
        });

        if (!ing) {
          await prisma.ingredients.create({
            data: { ingredient: ingredient },
          });
        }

        await prisma.recipeIngredients.create({
          data: {
            measurement: measurement,
            ingredientId: ing.ingredientId,
            recipeId: recipeId,
          },
        });
      };

      create();
    });

    const recipeId = uuidv4();

    let imagePath;
    if (!image) {
      imagePath = `{baseUrl}/static/images/${image}`;
    } else {
      imagePath = null;
    }

    const createdRec = await prisma.recipes.create({
      data: {
        recipeId,
        title,
        // add string literal here for env
        image: imagePath,
        users: {
          connect: { userId },
        },
        methods: {
          create: methods,
        },
      },
      include: {
        recipeIngredients: {
          select: {
            id: true,
            measurement: true,
            ingredientId: true,
          },
        },
        methods: {
          select: {
            id: true,
            stepNum: true,
            method: true,
          },
        },
      },
    });
    logger.info(createdRec);
  } catch (e) {
    logger.error(e);
  }
  createRecipes();
}
