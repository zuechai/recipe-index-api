const prisma = require("../../prisma");

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
      mappedIngredients.push({
        measurement,
        ingredient: {
          ingredient: foundIngredient.ingredient,
          ingredientId: foundIngredient.ingredientId,
        },
      });
    } else {
      const createdIngredient = await prisma.ingredients.create({
        data: { ingredient },
      });
      mappedIngredients.push({
        measurement,
        ingredient: createdIngredient,
      });
    }
  }
  return mappedIngredients;
}

module.exports = { findOrCreateIngredients };
