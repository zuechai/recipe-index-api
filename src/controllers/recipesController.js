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
  // try {
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
  // } catch (e) {
  //   res.status(500).send({ message: e });
  // }
};

const createRecipe = async (req, res) => {
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
        let ing;
        ing = await prisma.ingredients.findUnique({
          where: { ingredient: ingredient },
          select: {
            ingredientId: true,
          },
        });
        const recipeId = uuidv4();

        if (!ing) {
          ing = await prisma.ingredients.create({
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
    res.json(createdRec);
  } catch (e) {
    res.status(500).send("Caught at the end of createRecipe()");
  }
};

module.exports = {
  getRecipesBySearch,
  getSelectedRecipe,
  createRecipe,
};
