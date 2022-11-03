const { sqlize } = require("../utils/dbConnect");
const Recipe = require("../models/Recipe")(sqlize);

const userId = "b85362d6-10bb-42bd-9958-4e7f1b4ddc0d";

// gets all recipes for the logged in user
const getUserRecipes = async (_req, res) => {
  try {
    // error handling for invalid user or no token information
    const recipes = await Recipe.findAll({
      where: {
        user_id: userId,
      },
    });
    res.json(recipes);
  } catch (e) {
    res.status(500).send(e);
  }
};

// gets a single recipe by id
const getSelectedRecipe = async (req, res) => {
  const recipe = await Recipe.findOne({
    where: {
      user_id: userId,
      recipe_id: req.params.id,
    },
  });
  res.json(recipe);
};

module.exports = { getUserRecipes, getSelectedRecipe };
