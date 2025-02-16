const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require("joi");
const port = 3000;
const ParkingLot = require("./models/parkingLot");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { parkingLotSchema } = require("./schemas");

mongoose.connect("mongodb://localhost:27017/park-quest");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));
db.once("open", () => {
  console.log("Database connected!");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateParkingLot = (req, res, next) => {
  const { error } = parkingLotSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});
app.get(
  "/parkingLots",
  catchAsync(async (req, res) => {
    const parkingLots = await ParkingLot.find({});
    res.render("parkingLots/index", { parkingLots });
  })
);

app.get("/parkingLots/new", (req, res) => {
  res.render("parkingLots/new");
});
app.post(
  "/parkingLots",
  validateParkingLot,
  catchAsync(async (req, res) => {
    // if (!req.body.parkingLot)
    //   throw new ExpressError("Invalid Parking lot Data", 400);
    const parkingLot = new ParkingLot(req.body.parkingLot);
    await parkingLot.save();
    res.redirect(`/parkingLots/${parkingLot._id}`);
  })
);

app.get(
  "/parkingLots/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findById(id);
    res.render("parkingLots/show", { parkingLot });
  })
);

app.get(
  "/parkingLots/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const parkingLot = await ParkingLot.findById(id);
    res.render("parkingLots/edit", { parkingLot });
  })
);
app.put(
  "/parkingLots/:id",
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
    res.redirect(`/parkingLots/${id}`);
  })
);

app.delete(
  "/parkingLots/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await ParkingLot.findByIdAndDelete(id);
    res.redirect("/parkingLots");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found ", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No, We Caught An Error!";
  res.status(status).render("error", { err });
});

app.listen(port, () => {
  console.log(`Listening on ${port}!`);
});
