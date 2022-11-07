const { DataTypes, Model } = require("sequelize");
const { sqlize: sequelize } = require("../utils/dbConnect");
const Method = require("./Method");
const Ingredient = require("./Ingredient");
const RecipeIngredient = require("./RecipeIngredient");

class Recipe extends Model {}

Recipe.init(
  {
    recipeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
      onDelete: "cascade",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "Recipe",
    tableName: "recipes",
  }
);

Recipe.hasMany(Method, {
  foreignKey: "recipeId",
  onDelete: "cascade",
});
Method.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: "recipeId",
});

Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: "ingredientId",
});

module.exports = Recipe;
module.exports.default = Recipe;
