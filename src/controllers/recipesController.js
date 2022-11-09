const prisma = require("../prisma");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
app.use("/static", express.static("public"));

const getRecipesBySearch = async (req, res) => {
  const query = req.query.q;
  console.log(query);

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
};

// gets a single recipe by id
const getSelectedRecipe = async (req, res) => {
  try {
    const r = await prisma.recipes.findUnique({
      where: { recipeId: req.params.id },
      include: {
        recipeIngredients: {
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

    console.log(ings);

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
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

const createRecipe = async (req, res) => {
  // try {
  const recipe = {
    title: "Tortillas",
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
    collaborators: [{ userId: "8c6ae494-fd87-448d-b688-999784613c80" }],
  };

  const user = await prisma.users.findUnique({
    where: {
      username: "zuechai",
    },
  });

  const recipeId = uuidv4();

  const { ingredients, methods } = recipe;

  ingredients.forEach(({ measurement, ingredient }) => {
    const create = async () => {
      const found = await prisma.ingredients.findUnique({
        where: { ingredient: ingredient },
        select: {
          ingredientId: true,
        },
      });

      if (!found) {
        await prisma.ingredients.create({
          data: { ingredient: ingredient },
        });
      }

      await prisma.recipeIngredients.create({
        data: {
          measurement: measurement,
          ingredientId: found.ingredientId,
          recipeId: recipeId,
        },
      });
    };

    create();
  });

  const createdRec = await prisma.recipes.create({
    data: {
      recipeId,
      title: recipe.title,
      // add string literal here for env
      image: "http://localhost:5050/static/images/dashi-16-9.jpg",
      users: {
        connect: { userId: user.userId },
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
  res.json(createdRec);
  // } catch (e) {
  //   res.status(500).send("Caught at the end of createRecipe()");
  // }
};

module.exports = {
  getRecipesBySearch,
  getSelectedRecipe,
  createRecipe,
};
