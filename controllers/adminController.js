const weddingList = require("../models/weddingList.model");
const bride_grooms = require("../models/bride_grooms.model");
const weddingDay = require("../models/weddingDay.model");
const galleries = require("../models/galleries.model");

const createNewWedding = async (req, res) => {
  const {
    title,
    groomsName,
    groomsNick,
    groomsFatherName,
    groomsMotherName,
    groomsIg,
    bridesName,
    bridesNick,
    bridesFatherName,
    bridesMotherName,
    bridesIg,
    weddingCeremonySchedule,
    weddingCeremonyAddress,
    weddingCeremonyAddressLocation,
    weddingCeremonyMapLocation,
    weddingReceptionSchedule,
    weddingReceptionAddress,
    weddingReceptionAddressLocation,
    weddingReceptionMapLocation,
  } = req.body;

  try {
    if (
      title == "" ||
      groomsName == "" ||
      groomsNick == "" ||
      groomsFatherName == "" ||
      groomsMotherName == "" ||
      groomsIg == "" ||
      bridesName == "" ||
      bridesNick == "" ||
      bridesFatherName == "" ||
      bridesMotherName == "" ||
      bridesIg == "" ||
      weddingCeremonySchedule == "" ||
      weddingCeremonyAddress == "" ||
      weddingCeremonyAddressLocation == "" ||
      weddingCeremonyMapLocation == "" ||
      weddingReceptionSchedule == "" ||
      weddingReceptionAddress == "" ||
      weddingReceptionAddressLocation == "" ||
      weddingReceptionMapLocation == ""
    ) {
      res.status(404).send({
        message: `invalid parameter`,
      });
    }

    if (
      !req.files.weddingPhoto ||
      !req.files.groomsPhoto ||
      !req.files.bridesPhoto ||
      !req.files.gallery
    ) {
      res.status(404).send({
        message: `photo is required`,
      });
    }

    const weddingData = await weddingList.create({
      title,
      weddingPhoto: `wedding/${req.files.weddingPhoto[0].filename}`,
    });

    const groomsData = await bride_grooms.create({
      name: groomsName,
      nick: groomsNick,
      fatherName: groomsFatherName,
      motherName: groomsMotherName,
      ig: groomsIg,
      photos: `grooms/${req.files.groomsPhoto[0].filename}`,
      isBride: 0,
      weddingId: weddingData.id,
    });

    const bridesData = await bride_grooms.create({
      name: bridesName,
      nick: bridesNick,
      fatherName: bridesFatherName,
      motherName: bridesMotherName,
      ig: bridesIg,
      photos: `brides/${req.files.bridesPhoto[0].filename}`,
      isBride: 1,
      weddingId: weddingData.id,
    });

    const weddingCeremonyData = await weddingDay.create({
      scheduleTimestamp: weddingCeremonySchedule,
      address: weddingCeremonyAddress,
      addressLocation: weddingCeremonyAddressLocation,
      mapLocation: weddingCeremonyMapLocation,
      weddingId: weddingData.id,
      isCeremony: 1,
    });

    const weddingReceptionData = await weddingDay.create({
      scheduleTimestamp: weddingReceptionSchedule,
      address: weddingReceptionAddress,
      addressLocation: weddingReceptionAddressLocation,
      mapLocation: weddingReceptionMapLocation,
      weddingId: weddingData.id,
      isCeremony: 0,
    });

    const galleryPhoto = req.files.gallery.map((item, index) => {
      return { imageUrl: item.filename, weddingId: weddingData.id };
    });

    const galleryData = await galleries.bulkCreate(galleryPhoto);

    const data = {
      weddingData,
      groomsData,
      bridesData,
      weddingCeremonyData,
      weddingReceptionData,
      galleryData,
    };
    res.status(200).send({ responseCode: "00", message: "success", data });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log("TEST", error.errors[0].message);
      return res.status(500).send({
        message: error.errors[0].message,
      });
    }

    return res.status(500).send({
      message: `general error ${error}`,
    });
  }
};

const updateNewWedding = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    groomsName,
    groomsNick,
    groomsFatherName,
    groomsMotherName,
    groomsIg,
    bridesName,
    bridesNick,
    bridesFatherName,
    bridesMotherName,
    bridesIg,
    weddingCeremonySchedule,
    weddingCeremonyAddress,
    weddingCeremonyAddressLocation,
    weddingCeremonyMapLocation,
    weddingReceptionSchedule,
    weddingReceptionAddress,
    weddingReceptionAddressLocation,
    weddingReceptionMapLocation,
  } = req.body;
  try {
    const wedding = await weddingList.findOne({
      where: { id: id },
      include: [{ model: bride_grooms, as: "grooms" }],
    });

    if (!wedding) {
      return res.status(404).json({
        message: "wedding not found",
      });
    }

    const updateWedding = await weddingList.update(
      {
        ...(title && { title: title }),
        ...(req.files.weddingPhoto && {
          weddingPhoto: `wedding/${req.files.weddingPhoto[0].filename}`,
        }),
      },
      {
        where: {
          id,
        },
      }
    );

    const updateBrides = await bride_grooms.update(
      {
        ...(bridesName && { name: bridesName }),
        ...(bridesNick && { nick: bridesNick }),
        ...(bridesFatherName && { fatherName: bridesFatherName }),
        ...(bridesMotherName && { motherName: bridesMotherName }),
        ...(bridesIg && { ig: bridesIg }),
        ...(req.files.bridesPhoto && {
          photos: `brides/${req.files.bridesPhoto[0].filename}`,
        }),
      },
      {
        where: {
          isBride: 1,
          weddingId: wedding.id,
        },
      }
    );

    const updateGrooms = await bride_grooms.update(
      {
        ...(groomsName && { name: groomsName }),
        ...(groomsNick && { nick: groomsNick }),
        ...(groomsFatherName && { fatherName: groomsFatherName }),
        ...(groomsMotherName && { motherName: groomsMotherName }),
        ...(groomsIg && { ig: groomsIg }),
        ...(req.files.groomsPhoto && {
          photos: `grooms/${req.files.groomsPhoto[0].filename}`,
        }),
      },
      {
        where: {
          isBride: 0,
          weddingId: wedding.id,
        },
      }
    );

    const updateWeddingCeremony = await weddingDay.update(
      {
        ...(weddingCeremonySchedule && {
          scheduleTimestamp: weddingCeremonySchedule,
        }),
        ...(weddingCeremonyAddress && { address: weddingCeremonyAddress }),
        ...(weddingCeremonyAddressLocation && {
          addressLocation: weddingCeremonyAddressLocation,
        }),
        ...(weddingCeremonyMapLocation && {
          mapLocation: weddingCeremonyMapLocation,
        }),
      },
      {
        where: {
          isCeremony: 1,
          weddingId: wedding.id,
        },
      }
    );

    const updateWeddingReception = await weddingDay.update(
      {
        ...(weddingReceptionSchedule && {
          scheduleTimestamp: weddingReceptionSchedule,
        }),
        ...(weddingReceptionAddress && { address: weddingReceptionAddress }),
        ...(weddingReceptionAddressLocation && {
          addressLocation: weddingReceptionAddressLocation,
        }),
        ...(weddingReceptionMapLocation && {
          mapLocation: weddingReceptionMapLocation,
        }),
      },
      {
        where: {
          isCeremony: 0,
          weddingId: wedding.id,
        },
      }
    );

    return res.status(200).json({
      data: wedding,
      updated: {
        updateWedding,
        updateBrides,
        updateGrooms,
        updateWeddingCeremony,
        updateWeddingReception,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "general error" });
  }
};

const deleteGalleryById = async (req, res) => {
  const { id } = req.params;
  try {
    const gallery = await galleries.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({ status: 200, data: gallery });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to delete gallery photo" });
  }
};

module.exports = {
  createNewWedding,
  updateNewWedding,
  deleteGalleryById,
};
