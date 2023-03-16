const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const { findUserWithId } = require("../src/utils/dbUtils/usersUtils");
const {
  createRecipeIngredients,
} = require("../src/utils/dbUtils/recipeIngredientsUtils");
const {
  findOrCreateIngredients,
} = require("../src/utils/dbUtils/ingredientsUtils");
const { setImagePath } = require("../src/utils/dbUtils/imagesUtils");

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
  email: "zuechai@gmail.com",
};

const calvin = {
  userId: id2,
  firstName: "Calvin",
  lastName: "Mayfield Zuech",
  username: "calvin",
  email: "calvin@index.com",
};

const users = [anthony, calvin];

main(users, recipes);

//--------------

async function main(users, recipes) {
  // Insert users into the database
  for (let i = 0; i < users.length; i++) {
    await createUser(users[i]);
  }
  for (let i = 0; i < recipes.length; i++) {
    await createRecipe(recipes[i]);
  }
}

/**
 * INSERTS THE USER INTO THE DATABASE
 * @param {*} newUser
 */
async function createUser(newUser) {
  try {
    newUser.hashedPw = await bcrypt.hash("password", 10);
    await prisma.users.create({
      data: newUser,
    });
  } catch (err) {
    logger.error("Error in createUser()");
  }
}

/**
 * INSERTS THE RECIPE INTO THE DATABASE
 * @param {*} recipes
 */
async function createRecipe(recipe) {
  try {
    const { title, image, ingredients, methods } = recipe;

    const foundUser = await findUserWithId(anthony.userId);
    if (!foundUser) {
      logger.error("User not found");
      throw new Error("User not found" + foundUser);
    }

    const recipeId = uuidv4();

    const recipeIngredients = await findOrCreateIngredients(ingredients);
    if (ingredients.length !== recipeIngredients.length) {
      logger.error(
        "Arrays of ingredients requested and found/created do not match"
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
          connect: { userId: foundUser.userId },
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
    logger.error(`Error in createRecipe() ${err}`);
  }
}
