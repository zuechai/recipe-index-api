const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const logger = require("../utils/logger/logger");
const app = express();
app.use("/static", express.static("public"));

const getRecipesBySearch = async (req, res) => {
  logger.info("GET getRecipesBySearch");
  try {
    const query = req.query.q;
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
    logger.error(err);
    res.status(500).send({
      message: "Error retrieving user recipes",
      error: err,
    });
  }
};

// gets a single recipe by id
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

    logger.trace(ings);

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
    logger.error(err);
    res
      .status(500)
      .send({ message: "Error retrieving single recipe", error: err });
  }
};

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
    // check ingredients and methods have data
    res.json(recipeIngredients);

    // move to dbUtils/users.js
    async function findUserWithId(id) {
      return await prisma.users.findUnique({
        where: {
          userId: id,
        },
      });
    }

    // move to dbUtils/ingredients.js
    async function findOrCreateIngredients(ingredients) {
      const mappedIngredients = [];
      for (let i = 0; i < ingredients.length; i++) {
        const { ingredient, measurement } = ingredients[i];
        const foundIngredient = await prisma.ingredients.findUnique({
          where: { ingredient },
          select: {
            ingredientId: true,
            ingredient: true,
          },
        });
        if (foundIngredient) {
          mappedIngredients.push({ measurement, ingredient: foundIngredient });
        } else {
          const createdIngredient = await prisma.ingredients.create({
            data: { ingredient },
          });
          mappedIngredients.push({
            measurement,
            ingredient: createdIngredient,
          });
        }
        logger.trace(mappedIngredients);
      }
      return mappedIngredients;
    }

    // move to dbUtils/recipeIngredients.js
    async function createRecipeIngredients(
      recipeId,
      ingredientId,
      measurement
    ) {}

    //
  } catch (err) {
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
