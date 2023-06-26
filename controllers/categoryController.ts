import createHttpError from "http-errors";
import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
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
  const categories = await Category.find().sort({ name: 1 }).exec();

  res.render("category_form", {
    title: "Create Category",
    categories,
  });
});

// Create category on POST
exports.category_create_post = [
  body("name", "Category name must contain at least 2 letters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });
    const [categoryExists, categories] = await Promise.all([
      Category.findOne({ name: req.body.name }).exec(),
      Category.find().sort({ name: 1 }).exec(),
    ]);

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        categories,
        category,
        errors: errors.array(),
      });

      return;
    } else {
      if (categoryExists) {
        return res.redirect("/stocks/categories");
      } else {
        await category.save();
        res.redirect(category.items_url);
      }
    }
  }),
];

// Delete category on GET
exports.category_delete_get = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Category not found"));
  const [category, categories, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
    Item.find({ category: req.params.id }, "name").sort({ name: 1 }).exec(),
  ]);

  if (category === null) res.redirect("/stocks/categories");
  console.log(itemsInCategory);
  res.render("category_delete", {
    title: "Delete Category",
    category,
    categories,
    items: itemsInCategory,
  });
});

// Delete category on POST
exports.category_delete_post = asyncHandler(async function (req, res, next) {
  const [category, categories, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
    Item.find({ category: req.params.id }, "name").sort({ name: 1 }).exec(),
  ]);

  if (itemsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category,
      categories,
      items: itemsInCategory,
    });
    return;  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/stocks/categories");
  }
});

// Handle GET request for updating category
exports.category_update_get = asyncHandler(async function (req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id))
    return next(createHttpError(404, "Category not found"));
  const [category, categories] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (category === null)
    return next(createHttpError(404, "Category not found"));

  res.render("category_form", {
    title: "Update Category",
    category,
    categories,
  });
});

// Handle Post request for updating category
exports.category_update_post = [
  body("name", "Category name must contain at least 2 letters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);
    const category = new Category({
      _id: req.params.id,
      name: req.body.name
    })

    const categories = await Category.find().sort({ name: 1 }).exec()

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Update Category',
        category,
        categories,
        errors: errors.array(),
      })
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.items_url);
    }
  })
]
