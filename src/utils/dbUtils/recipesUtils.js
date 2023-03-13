const prisma = require("../../prisma");

async function findUniqueRecipe(id) {
  try {
    return await prisma.recipes.findUnique({
      where: { recipeId: id },
      include: {
        recipeIngredients: {
          select: {
            id: true,
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
            stepNum: true,
            method: true,
            updatedAt: true,
          },
        },
      },
    });
  } catch (error) {
    throw {
      status: 500,
      message: "Error getting recipe in findUniqueRecipe()",
    };
  }
}

module.exports = { findUniqueRecipe };
