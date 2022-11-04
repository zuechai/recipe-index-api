const { DataTypes } = require("sequelize");
module.exports = function (sequelize) {
  return sequelize.define(
    "recipes",
    {
      recipe_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        uniqueValue: true,
        onDelete: "cascade",
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      sequelize,
      tableName: "recipes",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "recipe_id" }],
        },
      ],
    }
  );
};
