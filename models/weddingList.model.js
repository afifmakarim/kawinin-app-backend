const { sequelize } = require("../database/db.config");
const { DataTypes } = require("sequelize");

const weddingList = sequelize.define(
  "weddingList",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    weddingPhoto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "weddingList",
  }
);

module.exports = weddingList;
