const prisma = require("../../prisma");
const logger = require("../logger/logger");

async function createRecipeIngredients(recipeId, ingredients) {
  if (!ingredients || Array(ingredients).length === 0) {
    throw {
      status: 400,
      message: "Cannot process an empty array of ingredients",
    };
  }
  const formattedData = ingredients.map(({ ingredient, measurement }) => {
    return {
      recipeId,
      ingredientId: ingredient.ingredientId,
      measurement,
    };
  });

  try {
    return await prisma.recipeIngredients.createMany({
      data: formattedData,
    });
  } catch (error) {
    throw {
      status: 500,
      message: "Error inserting recipe ingredients into database",
    };
  }
}

module.exports = { createRecipeIngredients };
