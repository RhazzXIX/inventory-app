import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100,
  },
});

CategorySchema.virtual("url").get(function () {
  return `/stocks/category/${this._id}`;
});

CategorySchema.virtual("items_url").get(function () {
  return `/stocks/category-items/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
