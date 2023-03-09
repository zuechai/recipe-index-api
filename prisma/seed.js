const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const logger = require("../src/utils/logger/logger");

// read recipes from json file
const fs = require("fs");
const filePath = "./prisma/recipeData.json";
const file = fs.readFileSync(filePath);
const recipes = JSON.parse(file);

// initialize user objects and array
const id1 = uuidv4();
const id2 = uuidv4();

const anthony = {
  userId: id1,
  firstName: "Anthony",
  lastName: "Zuech",
  username: "zuechai",
  email: "recipe@index.com",
};

const calvin = {
  userId: id2,
  firstName: "Calvin",
  lastName: "Mayfield Zuech",
  username: "calvin",
  email: "calvin@index.com",
};

const users = [anthony, calvin];

// Insert users into the database
for (let i = 0; i < users.length; i++) {
  await createUser(users[i]);
}

// Insert recipes into the database
for (let i = 0; i < recipes.length; i++) {
  await createRecipe(recipes);
}

//--------------

/**
 * INSERTS THE USER INTO THE DATABASE
 * @param {*} newUser
 */
async function createUser(newUser) {
  try {
    const created = await prisma.users.create({
      data: newUser,
    });
    logger.info(created);
  } catch (err) {
    logger.error(err);
  }
}

/**
 * INSERTS THE RECIPE INTO THE DATABASE
 * @param {*} recipes
 */
async function createRecipe(recipes) {
  try {
    const { title, image, ingredients, methods } = recipes;

    const foundUser = await findUserWithId(anthony.userId);
    if (!foundUser) {
      logger.Error(new Error("User not found"));
      throw new Error("User not found");
    }

    const recipeId = uuidv4();
    const recipeIngredients = await findOrCreateIngredients(ingredients);
    // check recipeIngredients and ingredients are the same length
    if (ingredients.length !== recipeIngredients.length) {
      logger.error(
        new Error(
          "Arrays of ingredients requested and found/created do not match"
        )
      );
      throw new Error(
        "Arrays of ingredients requested and found/created do not match"
      );
    }

    const imagePath = setImagePath(image);

    const createdRecipe = await prisma.recipes.create({
      data: {
        recipeId,
        title,
        image: imagePath,
        users: {
          connect: { userId },
        },
        methods: {
          create: methods,
        },
      },
    });

    await createRecipeIngredients(createdRecipe.recipeId, recipeIngredients);

    const finalCreatedRecipe = await prisma.recipes.findUnique({
      where: { recipeId: createdRecipe.recipeId },
      include: {
        recipeIngredients: true,
        methods: true,
      },
    });
    logger.info(finalCreatedRecipe);
  } catch (err) {
    logger.error(new Error(err));
  }
}
