const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const ParkingLot = require("../models/parkingLot");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findById(id);
    const review = new Review(req.body.review);
    parkingLot.reviews.push(review);
    await review.save();
    await parkingLot.save();
    req.flash("success", "Created a new Review!");
    res.redirect(`/parkingLots/${parkingLot._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await ParkingLot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "A delete process finished successfuly !");
    res.redirect(`/parkingLots/${id}`);
  })
);

module.exports = router;
