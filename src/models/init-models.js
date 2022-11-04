const DataTypes = require("sequelize").DataTypes;
const _collaborators = require("./Collaborator");
const _ingredient_lists = require("./IngredientList");
const _ingredients = require("./Ingredient");
const _methods = require("./Method");
const _recipes = require("./Recipe");
const _users = require("./User");

function initModels(sequelize) {
  const collaborators = _collaborators(sequelize, DataTypes);
  const ingredient_lists = _ingredient_lists(sequelize, DataTypes);
  const ingredients = _ingredients(sequelize, DataTypes);
  const methods = _methods(sequelize, DataTypes);
  const recipes = _recipes(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  // recipes and users
  recipes.belongsTo(users);
  users.hasMany(recipes);

  // recipes & methods
  recipes.hasMany(methods);
  methods.hasOne(recipes);

  // collaborators & recipes
  // many:many
  recipes.hasMany(collaborators);
  collaborators.belongsTo(recipes);

  // ingredients and recipes through ingredient lists
  recipes.belongsToMany(ingredients, { through: ingredient_lists });
  ingredients.belongsToMany(recipes, { through: ingredient_lists });

  return {
    collaborators,
    ingredient_lists,
    ingredients,
    methods,
    recipes,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
