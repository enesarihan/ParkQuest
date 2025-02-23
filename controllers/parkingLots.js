const ParkingLot = require("../models/parkingLot");

module.exports.index = async (req, res) => {
  const parkingLots = await ParkingLot.find({});
  res.render("parkingLots/index", { parkingLots });
};

module.exports.renderNewForm = (req, res) => {
  res.render("parkingLots/new");
};

module.exports.createParkingLot = async (req, res) => {
  const parkingLot = new ParkingLot(req.body.parkingLot);
  parkingLot.author = req.user._id;
  await parkingLot.save();
  req.flash("success", "Successfully made a new parking lot!");
  res.redirect(`/parkingLots/${parkingLot._id}`);
};

module.exports.showParkingLot = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findById(id);
  if (!parkingLot) {
    req.flash("error", "Cannot find that parking lot ");
    return res.redirect("/parkingLots");
  }
  res.render("parkingLots/edit", { parkingLot });
};

module.exports.editParkingLot = async (req, res) => {
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
};

module.exports.deleteParkingLot = async (req, res) => {
  const { id } = req.params;
  await ParkingLot.findByIdAndDelete(id);
  req.flash("success", "Parking lot has been deleted!");
  res.redirect("/parkingLots");
};
