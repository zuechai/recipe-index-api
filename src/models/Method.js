const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "methods",
    {
      method_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      recipe_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "cascade",
        references: {
          model: "recipes",
          key: "recipe_id",
        },
      },
      step_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      method: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "methods",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "method_id" }],
        },
        {
          name: "recipe_id",
          using: "BTREE",
          fields: [{ name: "recipe_id" }],
        },
      ],
    }
  );
};
