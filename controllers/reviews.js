const Review = require("../models/review");
const ParkingLot = require("../models/parkingLot");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  parkingLot.reviews.push(review);
  await review.save();
  await parkingLot.save();
  req.flash("success", "Created a new Review!");
  res.redirect(`/parkingLots/${parkingLot._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await ParkingLot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "A delete process finished successfuly !");
  res.redirect(`/parkingLots/${id}`);
};
