const { sqlize } = require("../utils/dbConnect");
const User = require("../models/User");
const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const Method = require("../models/Method");
const RecipeIngredient = require("../models/RecipeIngredient");

const userId = "e508e567-8ede-4cf8-ae55-09334696b2a1";

// gets all recipes for the logged in user
const getUserRecipes = async (_req, res) => {
  // retrieves logged in user from db
  const user = await User.findOne({
    where: {
      userId,
    },
  });
  // gets a list of all recipes with ingredient list
  const userRecipes = await user.getRecipes({
    include: [
      {
        model: Ingredient,
        attributes: ["ingredient", "ingredientId"],
        through: { attributes: [] },
      },
    ],
  });
  res.json(userRecipes);
  try {
  } catch (e) {
    res.status(500).send(e);
  }
};

// gets a single recipe by id
const getSelectedRecipe = async (req, res) => {
  try {
    const r = await Recipe.findOne({
      attributes: ["recipeId", "title", "image"],
      include: [
        {
          model: Ingredient,
          attributes: ["ingredient", "ingredientId"],
          through: { attributes: ["measurement"] },
        },
        {
          model: Method,
        },
      ],
      where: { recipeId: req.params.id },
      // raw: true,
    });

    console.log(r);

    const ingredients = r.Ingredients.map((ing) => {
      const { ingredientId, ingredient, RecipeIngredients } = ing.dataValues;
      return {
        id: ingredientId,
        ingredient,
        measurement: RecipeIngredients.dataValues.measurement,
      };
    });

    const methods = r.Methods.map((m) => {
      const { methodId, stepNum, method } = m.dataValues;
      return {
        id: methodId,
        stepNum,
        method,
      };
    });

    const sendRecipe = {
      id: r.recipeId,
      title: r.title,
      image: r.image,
      ingredients,
      methods,
    };

    res.json(sendRecipe);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

module.exports = { getUserRecipes, getSelectedRecipe };
