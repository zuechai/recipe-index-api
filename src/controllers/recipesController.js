const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const logger = require("../utils/logger/logger");
const app = express();
app.use("/static", express.static("public"));

const { findUserWithId } = require("../utils/dbUtils/usersUtils");
const { setImagePath } = require("../utils/dbUtils/imagesUtils");
const {
  findOrCreateIngredients,
} = require("../utils/dbUtils/ingredientsUtils");
const {
  createRecipeIngredients,
} = require("../utils/dbUtils/recipeIngredientsUtils");

/**
 * GET ALL RECIPES with an optional query
 * @http GET
 * @endpoint {baseUrl}/recipes || {baseUrl}/recipes?q={query}
 * @param req.query.contains {baseUrl}/recipes?contains=<string>'
 * @param res
 */
const getRecipesBySearch = async (req, res) => {
  logger.info("GET getRecipesBySearch");
  try {
    const query = req.query.contains;
    logger.trace(query);

    const results = await prisma.recipeIngredients.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        recipes: true,
      },
      distinct: ["recipeId"],
      where: {
        OR: [
          {
            recipes: {
              title: {
                contains: query,
              },
            },
          },
          {
            ingredients: {
              ingredient: {
                contains: query,
              },
            },
          },
        ],
      },
    });

    const recipes = results.map(({ recipes }) => recipes);

    res.json(recipes);
  } catch (err) {
    logger.error("Caught in getRecipes");
    res.status(500).send({
      message: "Error retrieving user recipes",
      error: err,
    });
  }
};

/**
 * GET SELECTED RECIPE
 * @http GET
 * @endpoint {base}/recipes/{:id}
 * @param {*} req
 * @param {*} res
 */
const getSelectedRecipe = async (req, res) => {
  logger.info("GET getSingleRecipe");
  try {
    const r = await prisma.recipes.findUnique({
      where: { recipeId: req.params.id },
      include: {
        recipeIngredients: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            measurement: true,
            ingredientId: true,
            ingredients: {
              select: {
                ingredient: true,
              },
            },
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

    const { recipeId, title, image, createdAt, updatedAt } = r;
    const { methods: methods, recipeIngredients: ings } = r;

    const ingredients = ings.map(
      ({ measurement, ingredientId, ingredients: i }) => {
        const { ingredient } = i;
        return {
          ingredientId,
          measurement,
          ingredient,
        };
      }
    );

    const recipe = {
      recipeId,
      title,
      image,
      createdAt,
      updatedAt,
      ingredients,
      methods,
    };

    res.json(recipe);
  } catch (err) {
    logger.error("Caught in getSelectedRecipe");
    res
      .status(500)
      .send({ message: "Error retrieving single recipe", error: err });
  }
};

/**
 * CREATES A NEW RECIPE
 * @http PUT
 * @endpoint {base}/recipes/add-recipe
 * @param {*} req
 * @param {*} res
 */
const createRecipe = async (req, res) => {
  logger.info("PUT createRecipe");
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({
        message: "No data present in the body of request to create a recipe",
      });
    }
    const { userId, title, image, ingredients, methods } = req.body;

    const foundUser = await findUserWithId(userId);
    if (!foundUser) {
      res.status(404).send({ message: "User not found" });
    }

    const recipeId = uuidv4();
    const recipeIngredients = await findOrCreateIngredients(ingredients);
    // check recipeIngredients and ingredients are the same length
    if (ingredients.length !== recipeIngredients.length) {
      res.status(400).send({
        message:
          "Arrays of ingredients requested and found/created do not match",
      });
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

    // needs to happen after the recipe object is added or as part of its creation using a nested createdMany
    await createRecipeIngredients(createdRecipe.recipeId, recipeIngredients);
    const finalCreatedRecipe = await prisma.recipes.findUnique({
      where: { recipeId: createdRecipe.recipeId },
      include: {
        recipeIngredients: true,
        methods: true,
      },
    });
    res.json(finalCreatedRecipe);
  } catch (err) {
    logger.error("Caught in createRecipe()");
    res
      .status(500)
      .send({ message: "Caught at the end of createRecipe()", error: err });
  }
};

module.exports = {
  getRecipesBySearch,
  getSelectedRecipe,
  createRecipe,
};
