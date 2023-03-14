const { recipeIngredients } = require("../prisma");

class Recipe {
  constructor(recipe) {
    this.recipe = recipe; // string
    this.id = recipe.recipeId; // string
    this.title = recipe.title; // string
    this.image = recipe.image; // string
    this.ingredients = recipe.recipeIngredients.map(
      ({ id, measurement, ingredientId, ingredients }) => ({
        id,
        measurement,
        ingredientId,
        ingredient: ingredients.ingredient,
      })
    ); // array{<string | number | null>}
    this.methods = recipe.methods; // array{<string | number>}
    this.userId = recipe.userId; // string
    this.createdAt = recipe.createdAt; // Date
    this.updatedAt = recipe.updatedAt; // Date
  }

  formatted() {
    return {
      id: this.id,
      title: this.title,
      image: this.image,
      ingredients: this.ingredients,
      methods: this.methods,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Recipe;
