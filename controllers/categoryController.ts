import createHttpError from "http-errors";
import express from 'express'
import asyncHandler from "express-async-handler";
const Category = require("../models/category");
const Item = require("../models/item");
const debug = require("debug")("category");

// Display items per category
exports.category_items = asyncHandler(async function (req, res, next) {
  res.send(`Not yet implemented ${req.params.id}`);
});

// Display list of categories
exports.category_list = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
});

// Create category on GET
exports.category_create_get = asyncHandler(async function (req, res, next) {
  res.send("Not yet implemented");
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
