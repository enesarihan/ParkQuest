const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const ParkingLot = require("../models/parkingLot");
const { parkingLotSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

const validateParkingLot = (req, res, next) => {
  const { error } = parkingLotSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const parkingLots = await ParkingLot.find({});
    res.render("parkingLots/index", { parkingLots });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("parkingLots/new");
});

router.post(
  "/",
  isLoggedIn,
  validateParkingLot,
  catchAsync(async (req, res) => {
    const parkingLot = new ParkingLot(req.body.parkingLot);
    await parkingLot.save();
    req.flash("success", "Successfully made a new parking lot!");
    res.redirect(`/parkingLots/${parkingLot._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findById(id).populate("reviews");
    if (!parkingLot) {
      req.flash("error", "Cannot find that parking lot ");
      return res.redirect("/parkingLots");
    }
    res.render("parkingLots/show", { parkingLot });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findById(id);
    if (!parkingLot) {
      req.flash("error", "Cannot find that parking lot ");
      return res.redirect("/parkingLots");
    }
    res.render("parkingLots/edit", { parkingLot });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  validateParkingLot,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findByIdAndUpdate(
      id,
      { ...req.body.parkingLot },
      {
        runValidators: true,
        new: true,
      }
    );
    await parkingLot.save();
    req.flash("success", "Successfully edited a parking lot!");

    res.redirect(`/parkingLots/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await ParkingLot.findByIdAndDelete(id);
    req.flash("success", "Parking lot has been deleted!");
    res.redirect("/parkingLots");
  })
);

module.exports = router;
