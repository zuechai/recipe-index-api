// imports
const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger/logger");
// utilities
const { findUserWithId } = require("../utils/dbUtils/usersUtils");
const { setImagePath } = require("../utils/dbUtils/imagesUtils");
const {
  findOrCreateIngredients,
} = require("../utils/dbUtils/ingredientsUtils");
const {
  createRecipeIngredients,
} = require("../utils/dbUtils/recipeIngredientsUtils");
const { findUniqueRecipe } = require("../utils/dbUtils/recipesUtils");

/**
 * GET ALL RECIPES with an optional query
 * @http GET
 * @endpoint {baseUrl}/recipes || {baseUrl}/recipes?q={query}
 * @param req.query.contains {baseUrl}/recipes?contains=<string>'
 * @param res
 */
const getRecipesBySearch = async (req, res, next) => {
  logger.info("GET getRecipesBySearch");
  try {
    let query = null;
    if (req.query.contains) {
      query = req.query.contains;
    }

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
  } catch (error) {
    next(error);
  }
};

/**
 * GET SELECTED RECIPE
 * @http GET
 * @endpoint {base}/recipes/{:id}
 * @param {*} req
 * @param {*} res
 */
const getSelectedRecipe = async (req, res, next) => {
  logger.info("GET getSingleRecipe");
  try {
    // check for recipe ID in request parameters
    if (!req.params.id) {
      throw {
        status: 400,
        message: "Recipe ID not provided in request parameters",
      };
    }
    // Search for the recipe by id in the database
    const Recipe = require("../models/RecipeModel");
    const foundRecipe = await findUniqueRecipe(req.params.id);
    const recipeClass = new Recipe(foundRecipe);
    logger.trace(recipeClass.toString());
    // throw {};
    // Check that a recipe by the provided ID exists
    if (!foundRecipe) {
      throw { status: 500, message: "Error retrieving recipe" };
    }
    // move all of this to a utility file for formatter the found recipe
    const { recipeId, title, image, createdAt, updatedAt } = foundRecipe;
    const { methods: methods, recipeIngredients: ingredients } = foundRecipe;
    const mappedIngredients = ingredients.map(
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
      mappedIngredients,
      methods,
    };
    // return the recipe
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

/**
 * CREATES A NEW RECIPE
 * @http PUT
 * @endpoint {base}/recipes/new-recipe
 * @param {*} req
 * @param {*} res
 */
const createRecipe = async (req, res, next) => {
  logger.info("PUT createRecipe");
  try {
    // Check that recipe is provided in the request body
    if (Object.keys(req.body).length === 0) {
      throw {
        status: 400,
        message: "No data present in the body of request to create a recipe",
      };
    }
    const { body } = req;
    // Check for required fields in the request body
    const keys = Object.keys(body);
    if (!keys.includes("userId", "title", "image", "ingredients", "methods")) {
      throw { status: 400, message: "Missing required fields in request body" };
    }

    // // CONSIDER IF MOVING MORE OF THIS TO A SERVICES FOLDER/FILE MAKES SENSE FOR MAINTENANCE AND SCALABILITY?

    const { userId, title, image, ingredients, methods } = body;
    // check the provided user ID
    const foundUser = await findUserWithId(userId);
    if (!foundUser) {
      throw { status: 404, message: "User not found" };
    }
    // insert recipe into database
    const recipeId = uuidv4();
    if (ingredients.length === 0) {
      throw { status: 400, message: "No ingredients provided in request body" };
    }
    const areIngredientsValid = ingredients.map((item) =>
      item.ingredient ? true : false
    );
    if (areIngredientsValid.includes(false)) {
      throw { status: 400, message: "Invalid ingredients provided" };
    }
    const recipeIngredients = await findOrCreateIngredients(ingredients);
    // check recipeIngredients and ingredients are the same length
    if (ingredients.length !== recipeIngredients.length) {
      res.status(400).send({
        message:
          "Arrays of ingredients requested and found/created do not match",
      });
    }
    const imagePath = setImagePath(image);
    // insert the recipe minus the recipeIngredients
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
    if (!createRecipe) {
      throw { status: 500, message: "Error inserting recipe into database" };
    }
    // add the recipeIngredients to the newly created recipe
    const createdRecipeIngredients = await createRecipeIngredients(
      createdRecipe.recipeId,
      recipeIngredients
    );
    // check for newly created recipe in database
    const finalCreatedRecipe = await findUniqueRecipe(createdRecipe.recipeId);
    if (!finalCreatedRecipe) {
      throw { status: 500, message: "Error finding the created recipe" };
    }
    res.json(finalCreatedRecipe);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecipesBySearch,
  getSelectedRecipe,
  createRecipe,
};
