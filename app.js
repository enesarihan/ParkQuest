const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const methodOverride = require("method-override");
const port = 3000;

const ExpressError = require("./utils/ExpressError");

const parkingLots = require("./routes/parkingLot");
const reviews = require("./routes/review");

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
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "cocacola",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash("success"));

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/parkingLots", parkingLots);
app.use("/parkingLots/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("home");
});

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
