import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    type: String,
    required: true,
    minLength: 3,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
});

ItemSchema.virtual("url").get(function () {
  return `/stocks/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
