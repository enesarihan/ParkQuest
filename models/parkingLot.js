const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
ImageSchema.virtual("hero").get(function () {
  return this.url.replace("/upload", "/upload/w_500,h_400");
});

const parkingLotSchema = new Schema({
  title: String,
  images: [ImageSchema],
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
