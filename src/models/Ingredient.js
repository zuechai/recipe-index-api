const { DataTypes, Model } = require("sequelize");
const { sqlize: sequelize } = require("../utils/dbConnect");
const Recipe = require("./Recipe");
const RecipeIngredient = require("./RecipeIngredient");

class Ingredient extends Model {}

Ingredient.init(
  {
    ingredientId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    ingredient: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Ingredient",
    tableName: "ingredients",
  }
);

module.exports = Ingredient;
module.exports.default = Ingredient;
