import createHttpError from "http-errors";
import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const Category = require("../models/category");
const Item = require("../models/item");
const debug = require("debug")("category");

// Display items per category
exports.category_items = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Category not found."));
  const [categories, category, itemsInCategory] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name price")
      .populate("category")
      .exec(),
  ]);
  if (category === null)
    return next(createHttpError(404, "Category not found"));
  if (itemsInCategory === null) {
    return next(
      createHttpError(404, `Items in category "${category.name}" not found.`)
    );
  } else {
    res.render("stock_index", {
      title: category.name,
      categories,
      items: itemsInCategory,
    });
  }
});

// Display list of categories
exports.category_list = asyncHandler(async function (req, res, next) {
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render("category_list", {
    title: "Category List",
    categories,
  });
});

// Create category on GET
exports.category_create_get = asyncHandler(async function (req, res, next) {
  const categories = await Category.find().sort({name: 1}).exec();

  res.render('category_form', {
    title: 'Create Category',
    categories,
  })
});

// Create category on POST
exports.category_create_post = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Delete category on GET
exports.category_delete_get = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Delete category on POST
exports.category_delete_post = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle GET request for updating category
exports.category_update_get = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle Post request for updating category
exports.category_update_post = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});
