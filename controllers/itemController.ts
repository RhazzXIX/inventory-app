import express from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import * as fs from "fs";
const multer = require("multer");
const upload = multer({ dest: "public/data/uploads" });
const Category = require("../models/category");
const Item = require("../models/item");

// Handle GET request for showing all items
exports.index = asyncHandler(async function (req, res, next) {
  const [items, categories] = await Promise.all([
    Item.find({}, "name price img").exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  res.render("stock_index", {
    title: "All Items",
    categories,
    items,
    adtnlCss: '/stylesheets/stock_index.css'
  });
});

// Handle Get request for showing item detail
exports.item_detail = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Item not found"));

  const [categories, item] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Item.findById(req.params.id).exec(),
  ]);

  if (item === null) return next(createHttpError(404, "Item not found."));

  res.render("item_detail", {
    title: item.name,
    categories,
    item,
  });
});

// Handle GET request for creating item.
exports.item_create_get = asyncHandler(async function (req, res, next) {
  const categories = await Category.find().sort({ name: 1 }).exec();
  res.render("item_form", {
    title: "Create Item",
    categories,
  });
});

// Handle POST request for creating item.
exports.item_create_post = [
  body("name", "Name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price")
    .notEmpty()
    .withMessage("Price should have value")
    .isFloat({
      gt: 0,
    })
    .withMessage("Price must be greater than 0")
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
    });
    if (!errors.isEmpty()) {
      const categories = await Category.find().sort({ name: 1 }).exec();
      res.render("item_form", {
        title: "Create Item",
        item,
        categories,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(`${item.url}/image/upload`);
    }
  }),
];

// Handle GET request for uploading item image
exports.itemImg_upload_get = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Item not found"));
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (item === null) return next(createHttpError(404, "Item not found"));
  res.render("item_img_form", {
    title: "Upload Image",
    item,
    categories,
  });
});

// Handle POST request for uploading item image
exports.itemImg_upload_post = [
  upload.single("itemImg"),
  asyncHandler(async function (req, res, next) {
    if (!mongoose.isValidObjectId(req.params.id))
      return next(createHttpError(404, "Item not found"));
    const [item, categories] = await Promise.all([
      Item.findById(req.params.id).exec(),
      Category.find().sort({ name: 1 }).exec(),
    ]);
    if (item === null) return next(createHttpError(404, "Item not found"));
    if (req.file) {
      console.log(item);
      if (item.img) {
        fs.unlink(item.img, (err) => {
          if (err) next(err);
          console.log(`Deleted ${item.img}`);
        });
      }
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        { img: req.file.path },
        {}
      ).exec();
      res.redirect(updatedItem.url);
    }
  }),
];

// Handle GET request for deleting item.
exports.item_delete_get = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Item not found"));
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (item === null) return next(createHttpError(404, "Item not found."));
  res.render("item_detail", {
    title: "Delete Item",
    item,
    categories,
    deleteItem: true,
  });
});

// Handle POST request for deleting item.
exports.item_delete_post = [
  body("password", "Wrong password! Password is on README")
    .trim()
    .equals("deleteItem")
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    const [item, categories] = await Promise.all([
      Item.findById(req.params.id).exec(),
      Category.find().sort({ name: 1 }).exec(),
    ]);
    if (!errors.isEmpty()) {
      res.render("item_detail", {
        title: "Delete Item",
        item,
        categories,
        deleteItem: true,
        errors: errors.array(),
      });
    } else {
      if (item.img) {
        fs.unlink(item.img, (err)=> {
          if (err) next(err)
          console.log(`Deleted ${item.img}`)
        })
      }
      await Item.findByIdAndRemove(req.body.itemid);
      res.redirect("/stocks");
    }
  }),
];

// Handle GET request for updating item.
exports.item_update_get = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Item not found."));
  const [item, categories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);
  if (item === null) return next(createHttpError(404, "Item not found."));
  res.render("item_form", {
    title: "Update Item",
    item,
    categories,
  });
});

// Handle POST request for updating item.
exports.item_update_post = [
  body("name", "Name must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must contain at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price")
    .notEmpty()
    .withMessage("Price should have value")
    .isFloat({
      gt: 0,
    })
    .withMessage("Price must be greater than 0")
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    const item = new Item({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find().sort({ name: 1 }).exec();
      res.render("item_form", {
        title: "Update Item",
        item,
        categories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        item,
        {}
      ).exec();
      res.redirect(`${updatedItem.url}/image/upload`);
    }
  }),
];
