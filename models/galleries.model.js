const { sequelize } = require("../database/db.config");
const { DataTypes } = require("sequelize");
const weddingList = require("./weddingList.model");

const galleries = sequelize.define(
  "galleries",
  {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weddingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "galleries",
  }
);

weddingList.hasMany(galleries, {
  foreignKey: "weddingId",
});

module.exports = galleries;
