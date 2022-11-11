var express = require("express");
var router = express.Router();
const multer = require("multer");

const {
  getWeddingById,
  getAllWedding,
  deleteWeddingById,
} = require("../controllers/apiControllers");
const {
  createNewWedding,
  updateNewWedding,
  deleteGalleryById,
} = require("../controllers/adminController");
const { uploadFile } = require("../middleware");

router.get("/wedding/:id", getWeddingById);
router.get("/wedding", getAllWedding);
router.post("/wedding", [uploadFile], createNewWedding);
router.delete("/wedding/:id", deleteWeddingById);
router.delete("/wedding/gallery/:id", deleteGalleryById);

router.put("/wedding/:id", [uploadFile], updateNewWedding);

module.exports = router;
