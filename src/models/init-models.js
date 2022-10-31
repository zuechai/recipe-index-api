const DataTypes = require("sequelize").DataTypes;
const _collaborators = require("./Collaborator");
const _ingredient_lists = require("./IngredientList");
const _ingredients = require("./Ingredient");
const _methods = require("./Method");
const _recipes = require("./Recipe");
const _test_users = require("./TestUser");
const _units = require("./Unit");
const _users = require("./User");

function initModels(sequelize) {
  const collaborators = _collaborators(sequelize, DataTypes);
  const ingredient_lists = _ingredient_lists(sequelize, DataTypes);
  const ingredients = _ingredients(sequelize, DataTypes);
  const methods = _methods(sequelize, DataTypes);
  const recipes = _recipes(sequelize, DataTypes);
  const test_users = _test_users(sequelize, DataTypes);
  const units = _units(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  ingredient_lists.belongsTo(ingredients, {
    as: "ingredient",
    foreignKey: "ingredient_id",
  });
  ingredients.hasMany(ingredient_lists, {
    as: "ingredient_lists",
    foreignKey: "ingredient_id",
  });
  collaborators.belongsTo(recipes, { as: "recipe", foreignKey: "recipe_id" });
  recipes.hasMany(collaborators, {
    as: "collaborators",
    foreignKey: "recipe_id",
  });
  collaborators.belongsTo(recipes, { as: "author", foreignKey: "author_id" });
  recipes.hasMany(collaborators, {
    as: "author_collaborators",
    foreignKey: "author_id",
  });
  ingredient_lists.belongsTo(recipes, {
    as: "recipe",
    foreignKey: "recipe_id",
  });
  recipes.hasMany(ingredient_lists, {
    as: "ingredient_lists",
    foreignKey: "recipe_id",
  });
  methods.belongsTo(recipes, { as: "recipe", foreignKey: "recipe_id" });
  recipes.hasMany(methods, { as: "methods", foreignKey: "recipe_id" });
  ingredient_lists.belongsTo(units, { as: "unit", foreignKey: "unit_id" });
  units.hasMany(ingredient_lists, {
    as: "ingredient_lists",
    foreignKey: "unit_id",
  });
  collaborators.belongsTo(users, {
    as: "collaborator",
    foreignKey: "collaborator_id",
  });
  users.hasMany(collaborators, {
    as: "collaborators",
    foreignKey: "collaborator_id",
  });
  recipes.belongsTo(users, { as: "author", foreignKey: "author_id" });
  users.hasMany(recipes, { as: "recipes", foreignKey: "author_id" });

  return {
    collaborators,
    ingredient_lists,
    ingredients,
    methods,
    recipes,
    test_users,
    units,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
