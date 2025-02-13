const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ParkingLot = require("./models/parkingLot");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const port = 3000;

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

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/parkingLots", async (req, res) => {
  const parkingLots = await ParkingLot.find({});
  res.render("parkingLots/index", { parkingLots });
});

app.get("/parkingLots/new", (req, res) => {
  res.render("parkingLots/new");
});
app.post("/parkingLots", async (req, res) => {
  const parkingLot = new ParkingLot(req.body.parkingLot);
  await parkingLot.save();
  res.redirect(`/parkingLots/${parkingLot._id}`);
});

app.get("/parkingLots/:id", async (req, res) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findById(id);
  res.render("parkingLots/show", { parkingLot });
});

app.get("/parkingLots/:id/edit", async (req, res) => {
  const { id } = req.params;
  const parkingLot = await ParkingLot.findById(id);
  res.render("parkingLots/edit", { parkingLot });
});
app.put("/parkingLots/:id", async (req, res) => {
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
});

app.delete("/parkingLots/:id", async (req, res) => {
  const { id } = req.params;
  await ParkingLot.findByIdAndDelete(id);
  res.redirect("/parkingLots");
});

app.listen(port, () => {
  console.log(`Listening on ${port}!`);
});
