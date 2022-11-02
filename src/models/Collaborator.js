const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "collaborators",
    {
      recipe_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        onDelete: "cascade",
        references: {
          model: "recipes",
          key: "recipe_id",
        },
      },
      recipe_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "cascade",
        references: {
          model: "recipes",
          key: "user_id",
        },
      },
      collaborator_id: {
        type: DataTypes.UUID,
        allowNull: true,
        onDelete: null,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      can_edit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "collaborators",
      timestamps: true,
      indexes: [
        {
          name: "recipe_id",
          using: "BTREE",
          fields: [{ name: "recipe_id" }],
        },
        {
          name: "recipe_user_id",
          using: "BTREE",
          fields: [{ name: "recipe_user_id" }],
        },
        {
          name: "collaborator_id",
          using: "BTREE",
          fields: [{ name: "collaborator_id" }],
        },
      ],
    }
  );
};
