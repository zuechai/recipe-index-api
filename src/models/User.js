const { DataTypes, Model } = require("sequelize");
const { sqlize: sequelize } = require("../utils/dbConnect");
const Collaborator = require("./Collaborator");
const Recipe = require("./Recipe");

class User extends Model {}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

User.hasMany(Recipe, {
  foreignKey: "userId",
});
Recipe.belongsTo(User, {
  foreignKey: "userId",
});

// User.belongsToMany(Recipe, { through: Collaborator });
// Recipe.belongsToMany(User, { through: Collaborator });

module.exports = User;
module.exports.default = User;
