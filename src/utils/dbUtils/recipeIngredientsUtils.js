const prisma = require("../../prisma");
const logger = require("../logger/logger");

async function createRecipeIngredients(recipeId, ingredients) {
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
  } catch (e) {
    logger.debug(e);
    throw new Error(e);
  }
}

module.exports = { createRecipeIngredients };
