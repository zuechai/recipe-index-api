const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "ingredients",
    {
      ingredient_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      ingredient: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preparation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "ingredients",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "ingredient_id" }],
        },
      ],
    }
  );
};
