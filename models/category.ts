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
  return `/shop/category/${this.name.toLowerCase()}`;
});

module.exports = mongoose.model("Category", CategorySchema);
