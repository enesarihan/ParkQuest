const mongoose = require("mongoose");
const ParkingLot = require("../models/parkingLot");
const cities = require("./cities");
const { places, descriptors } = require("./seedhelpers");
const axios = require("axios");

mongoose.connect("mongodb://localhost:27017/park-quest");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));
db.once("open", () => {
  console.log("Database connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await ParkingLot.deleteMany({});
  for (let i = 0; i <= 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000) + 1;
    const price = Math.floor(Math.random() * 60) + 1;
    const randomParks = new ParkingLot({
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://picsum.photos/400?random=${Math.random()}",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae eveniet laudantium optio voluptas modi. Similique quae provident sint veniam quo quia earum neque architecto ullam voluptate harum, totam, cum suscipit!",
      price: price,
    });
    await randomParks.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
