const { sqlize } = require("../utils/dbConnect");
const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
app.use("/static", express.static("public"));

// gets all recipes for the logged in user
const getUserRecipes = async (_req, res) => {
  // retrieves logged in user from db

  // await prisma.users.create({
  //   data: {
  //     userId: uuidv4(),
  //     firstName: "Anthony",
  //     lastName: "Zuech",
  //     username: "zuechai",
  //     email: "zuechai@gmail.com",
  //   },
  // });

  const user = await prisma.users.findUnique({
    where: { username: "zuechai" },
    include: {
      Recipes: {
        include: {
          recipeIngredient: true,
        },
      },
    },
  });

  res.json(user);
  try {
  } catch (e) {
    res.status(500).send(e);
  }
};

// gets a single recipe by id
const getSelectedRecipe = async (req, res) => {
  try {
    const r = await prisma.recipes.findUnique({
      where: { recipeId: req.params.id },
      include: {
        recipeIngredient: {
          select: {
            measurement: true,
            ingredientId: true,
            ingredient: {
              select: {
                ingredient: true,
              },
            },
          },
        },
        Methods: {
          select: {
            id: true,
            stepNum: true,
            method: true,
          },
        },
      },
    });

    const { recipeId, title, image, createdAt, updatedAt } = r;
    const { Methods: method, recipeIngredient: ing } = r;

    const ingredients = ing.map(
      ({ measurement, ingredientId, ingredient: ing }) => {
        const { ingredient } = ing;
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
      method,
    };

    res.json(recipe);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

const createRecipe = async (req, res) => {
  // try {
  const recipe = {
    title: "Guacamole",
    image: null,
    ingredients: [
      {
        ingredient: "onion",
        measurement: "2 tablespoon",
      },
      {
        ingredient: "garlic",
        measurement: "1 clove",
      },
      {
        ingredient: "jalapeno",
        measurement: "1 seeded",
      },
      {
        ingredient: "cilantro",
        measurement: ".25 cup",
      },
      {
        ingredient: "avocados",
        measurement: "2",
      },
      {
        ingredient: "lime",
        measurement: "2 tablespoons",
      },
      {
        ingredient: "salt",
        measurement: "1 teaspoon",
      },
    ],
    methods: [
      {
        stepNum: 1,
        method: "Tortillas Earthnut pea potato.",
      },
      {
        stepNum: 2,
        method: "Griddle Quandong swiss chard.",
      },
      {
        stepNum: 3,
        method:
          "Wrap to steam with residual heat. Salsify taro catsear garlic gram celery.",
      },
    ],
  };

  const user = await prisma.users.findUnique({
    where: {
      username: "zuechai",
    },
  });

  const recipeId = uuidv4();

  const { ingredients, methods } = recipe;

  ingredients.forEach(({ measurement, ingredient }) => {
    console.log(ingredient);
    const create = async () => {
      let found = await prisma.ingredients.findUnique({
        where: { ingredient: ingredient },
        select: {
          ingredientId: true,
        },
      });
      console.log(found);
      if (!found) {
        found = await prisma.ingredients.create({
          data: { ingredient: ingredient },
        });
        console.log(found);
      }
      const result = await prisma.recipeIngredients.create({
        data: {
          measurement: measurement,
          ingredientId: found.ingredientId,
          recipeId: recipeId,
        },
      });
      console.log(result);
    };
    create();
  });

  const createdRec = await prisma.recipes.create({
    data: {
      recipeId,
      title: recipe.title,
      image: null,
      user: {
        connect: { userId: user.userId },
      },
      Methods: {
        create: methods,
      },
    },
    include: {
      recipeIngredient: {
        select: {
          id: true,
          measurement: true,
          ingredientId: true,
        },
      },
      Methods: {
        select: {
          id: true,
          stepNum: true,
          method: true,
        },
      },
    },
  });
  res.json(createdRec);
  // } catch (e) {
  //   res.status(500).send("Caught at the end of createRecipe()");
  // }
};

module.exports = { getUserRecipes, getSelectedRecipe, createRecipe };
