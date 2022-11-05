const { DataTypes, Model } = require("sequelize");
const { sqlize: sequelize } = require("../utils/dbConnect");
const Recipe = require("./Recipe");
const Ingredient = require("./Ingredient");

class RecipeIngredient extends Model {}

RecipeIngredient.init(
  {
    measurement: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "RecipeIngredients",
    tableName: "recipe_ingredients",
  }
);

// Recipe.belongsToMany(Ingredient, {
//   through: RecipeIngredient,
//   foreignKey: "recipeId",
// });

// Ingredient.belongsToMany(Recipe, {
//   through: RecipeIngredient,
//   foreignKey: "ingredientId",
// });

module.exports = RecipeIngredient;
module.exports.default = RecipeIngredient;
