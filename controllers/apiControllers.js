const weddingList = require("../models/weddingList.model");
const bride_grooms = require("../models/bride_grooms.model");
const weddingDay = require("../models/weddingDay.model");
const galleries = require("../models/galleries.model");

const getWeddingById = async (req, res) => {
  try {
    const { id } = req.params;
    const wedding = await weddingList.findOne({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      where: { id: id },
    });

    if (!wedding) {
      return res.status(404).send({ status: `wedding ID ${id} not found` });
    }

    const brides = await bride_grooms.findOne({
      attributes: {
        exclude: ["id", "isBride", "weddingId", "createdAt", "updatedAt"],
      },
      where: { isBride: 1, weddingId: id },
    });

    const grooms = await bride_grooms.findOne({
      attributes: {
        exclude: ["id", "isBride", "weddingId", "createdAt", "updatedAt"],
      },
      where: { isBride: 0, weddingId: id },
    });

    // get wedding ceremony
    const weddingCeremonyData = await weddingDay.findOne({
      where: { isCeremony: 1, weddingId: id },
    });
    const date = new Date(weddingCeremonyData.scheduleTimestamp);
    const myDays = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    const weddingCeremony = {
      dates: {
        day: myDays[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleString("default", {
          month: "long",
        }),
        year: date.getFullYear(),
        fastTime: weddingCeremonyData.scheduleTimestamp,
      },
      time: `Pukul ${date.toLocaleTimeString("en-GB", {
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
      })} - Selesai`,
      address: weddingCeremonyData.address,
      addressLocation: weddingCeremonyData.addressLocation,
      mapLocation: weddingCeremonyData.mapLocation,
    };

    // get wedding receptions
    const weddingReceptionData = await weddingDay.findOne({
      where: { isCeremony: 0, weddingId: id },
    });
    const receptionDate = new Date(weddingReceptionData.scheduleTimestamp);

    const weddingReception = {
      dates: {
        day: myDays[receptionDate.getDay()],
        date: receptionDate.getDate(),
        month: receptionDate.toLocaleString("default", {
          month: "long",
        }),
        year: receptionDate.getFullYear(),
        fastTime: weddingReceptionData.scheduleTimestamp,
      },
      time: `Pukul ${receptionDate.toLocaleTimeString("en-GB", {
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
      })} - Selesai`,
      address: weddingReceptionData.address,
      addressLocation: weddingReceptionData.addressLocation,
      mapLocation: weddingReceptionData.mapLocation,
    };

    // get galleries
    const galleryList = await galleries.findAll({
      attributes: {
        exclude: ["id", "weddingId", "createdAt", "updatedAt"],
      },
      where: { weddingId: id },
    });

    const payload = {
      ...wedding.dataValues,
      grooms,
      brides,
      weddingCeremony,
      weddingReception,
      galleries: galleryList,
    };

    return res.status(200).send(payload);
  } catch (error) {
    return res.status(500).send({ status: "system internal error" });
  }
};

const getAllWedding = async (req, res) => {
  try {
    const wedding = await weddingList.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return res
      .status(200)
      .json({ status: 200, message: "success", data: wedding });
  } catch (error) {
    console.log(error);
  }
};

const deleteWeddingById = async (req, res) => {
  try {
    const { id } = req.params;
    const wedding = await weddingList.destroy({
      where: {
        id,
      },
    });

    if (!wedding) {
      return res.status(404).json({
        status: 404,
        message: `failed to delete data, ${id} not found`,
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: `success delete ${id}`, data: wedding });
  } catch (error) {
    return res
      .status(404)
      .json({ status: 404, message: `failed to delete ${id}`, data: error });
  }
};
module.exports = { getWeddingById, getAllWedding, deleteWeddingById };
