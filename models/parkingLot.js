const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const parkingLotSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

parkingLotSchema.post("findOneAndDelete", async (doc) => {
  if (doc.reviews.length) {
    const res = await Review.deleteMany({ _id: { $in: doc.reviews } });
    console.log(res);
  }
});

module.exports = mongoose.model("ParkingLot", parkingLotSchema);
