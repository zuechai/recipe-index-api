const { DataTypes, Model } = require("sequelize");
const { sqlize: sequelize } = require("../utils/dbConnect");

class Method extends Model {}

Method.init(
  {
    stepNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.TEXT,
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
