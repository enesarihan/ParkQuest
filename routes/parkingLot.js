const express = require("express");
const router = express.Router();
const parkingLots = require("../controllers/parkingLots");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateParkingLot, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(parkingLots.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateParkingLot,
    catchAsync(parkingLots.createParkingLot)
  );

router.get("/new", isLoggedIn, parkingLots.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(parkingLots.showParkingLot))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateParkingLot,
    catchAsync(parkingLots.editParkingLot)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(parkingLots.deleteParkingLot));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(parkingLots.renderEditForm)
);

module.exports = router;
