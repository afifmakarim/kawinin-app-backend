const { sequelize } = require("../database/db.config");
const { DataTypes } = require("sequelize");
const weddingList = require("./weddingList.model");

const bride_groom = sequelize.define(
  "bride_groom",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nick: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    motherName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ig: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isBride: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    photos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weddingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "bride_groom",
  }
);

weddingList.hasMany(bride_groom, {
  foreignKey: "weddingId",
  as: "grooms",
});

bride_groom.belongsTo(weddingList, {
  foreignKey: "weddingId",
  as: "wedding",
});

module.exports = bride_groom;
