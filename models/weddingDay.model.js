const { sequelize } = require("../database/db.config");
const { DataTypes } = require("sequelize");
const weddingList = require("./weddingList.model");

const weddingDay = sequelize.define(
  "weddingDay",
  {
    scheduleTimestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    isCeremony: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    address: { type: DataTypes.STRING, allowNull: false },
    addressLocation: { type: DataTypes.STRING, allowNull: false },
    mapLocation: { type: DataTypes.STRING, allowNull: false },
    weddingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "weddingDay",
  }
);

weddingList.hasMany(weddingDay, {
  foreignKey: "weddingId",
  as: "day",
});

weddingDay.belongsTo(weddingList, {
  foreignKey: "weddingId",
  as: "wedding",
});

module.exports = weddingDay;
