const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ParkingLot = require("../models/parkingLot");
const { isLoggedIn, validateParkingLot, isAuthor } = require("../middleware");

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
    parkingLot.author = req.user._id;
    await parkingLot.save();
    req.flash("success", "Successfully made a new parking lot!");
    res.redirect(`/parkingLots/${parkingLot._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
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
  isAuthor,
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
  isAuthor,
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await ParkingLot.findByIdAndDelete(id);
    req.flash("success", "Parking lot has been deleted!");
    res.redirect("/parkingLots");
  })
);

module.exports = router;
