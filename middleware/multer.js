const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const { v4: uuidv4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "weddingPhoto") {
      return cb(null, "./" + "public/images/wedding");
    } else if (file.fieldname === "groomsPhoto") {
      return cb(null, "./" + "public/images/grooms");
    } else if (file.fieldname === "bridesPhoto") {
      return cb(null, "./" + "public/images/brides");
    } else {
      return cb(null, "./" + "public/images");
    }
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, uuidv4() + "_" + file.originalname);
  },
});

function uploadFile(req, res, next) {
  let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, cb) => {
      if (
        file.fieldname === "weddingPhoto" ||
        file.fieldname === "groomsPhoto" ||
        file.fieldname === "bridesPhoto" ||
        file.fieldname === "gallery"
      ) {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "image/jpeg"
        ) {
          cb(null, true);
        } else {
          cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
        }
      } else {
        cb(new Error("There was an unknown error"));
      }
    },
  }).fields([
    {
      name: "weddingPhoto",
      maxCount: 1,
    },
    {
      name: "groomsPhoto",
      maxCount: 1,
    },
    {
      name: "bridesPhoto",
      maxCount: 1,
    },
    {
      name: "gallery",
      maxCount: 4,
    },
  ]);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).send({ status: "Max file size 10MB allowed!" });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).send({ status: err.message });
    }
    // Everything went fine.
    next();
  });
}
let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
