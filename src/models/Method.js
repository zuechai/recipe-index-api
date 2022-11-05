const { DataTypes, Model } = require("sequelize");
const { sqlize: sequelize } = require("../utils/dbConnect");

class Method extends Model {}

Method.init(
  {
    methodId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    stepNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Method",
    tableName: "methods",
  }
);

module.exports = Method;
module.exports.default = Method;
