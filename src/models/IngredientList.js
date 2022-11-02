const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "ingredient_lists",
    {
      recipe_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "cascade",
        references: {
          model: "recipes",
          key: "recipe_id",
        },
      },
      ingredient_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "ingredients",
          key: "ingredient_id",
        },
      },
      measurement: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
      },
      unit_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "units",
          key: "unit_id",
        },
      },
    },
    {
      sequelize,
      tableName: "ingredient_lists",
      timestamps: true,
      indexes: [
        {
          name: "recipe_id",
          using: "BTREE",
          fields: [{ name: "recipe_id" }],
        },
        {
          name: "ingredient_id",
          using: "BTREE",
          fields: [{ name: "ingredient_id" }],
        },
        {
          name: "unit_id",
          using: "BTREE",
          fields: [{ name: "unit_id" }],
        },
      ],
    }
  );
};
