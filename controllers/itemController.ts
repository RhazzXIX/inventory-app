import express from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
const Category = require("../models/category");
const Item = require("../models/item");

// Handle GET request for showing all items
exports.index = asyncHandler(async function (req, res, next) {
  const [items, categories] = await Promise.all([
    Item.find({}, "name price").exec(),
    Category.find().exec(),
  ]);

  res.render("stock_index", {
    title: "All Items",
    categories,
    items,
  });
});

// Handle Get request for showing item detail
exports.item_detail = asyncHandler(async function (req, res, next) {
  res.send(`Not yet implemented ${req.params.id}`);
});

// Handle GET request for creating item.
exports.item_create_get = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle POST request for creating item.
exports.item_create_post = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle GET request for deleting item.
exports.item_delete_get = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle POST request for deleting item.
exports.item_delete_post = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle GET request for updating item.
exports.item_update_get = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Handle POST request for updating item.
exports.item_update_post = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});