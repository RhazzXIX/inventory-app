#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

import { Types } from "mongoose";
const Item = require("./models/item");
const Category = require("./models/category");

const categories: Types.ObjectId[] = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  await createCaterogies(),
    await createItems(),
    console.log("Debug: Should be connected?");
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(name: string) {
  const category = new Category({ name: name });
  await category.save();
  categories.push(category);
  console.log(`Category saved ${name}`);
}

async function createCaterogies() {
  console.log("Adding categories");
  await categoryCreate("Beef");
  await categoryCreate("Pork");
  await categoryCreate("Chicken");
  await categoryCreate("Seafood");
  await categoryCreate("Lamb");
}

async function itemCreate(
  name: string,
  description: string,
  category: Types.ObjectId,
  price: number
) {
  const item = new Item({
    name,
    description,
    category,
    price,
  });
  await item.save();
  console.log(`Item saved ${name}`);
}

async function createItems() {
  console.log(`Adding Items`);
  await Promise.all([
    itemCreate(
      "Skirt steak",
      "A thin and fatty cut of beef that comes from the plate primal, below the rib, towards the front of the cow. It has a loose texture and a robust beefy flavor. You can grill it as a whole steak or cut into strips for tacos or fajitas. You should marinate it before grilling to add flavor and moisture, and slice it thinly against the grain after grilling to make it more tender.",
      categories[0],
      2.0
    ),
    itemCreate(
      "A5 Wagyu beef",
      "A tender, juicy, and flavorful beef with crazy marbling of fat which comes from Japan.",
      categories[0],
      50.0
    ),
    itemCreate(
      "Pork Ribs",
      "A succulent and meaty cut of meat that comes from the rib cage of the pig. It can be grilled or roasted with barbecue sauce or a dry rub. It can be either baby back ribs or American-style ribs, depending on the location of the ribs.",
      categories[1],
      1.25
    ),
    itemCreate(
      "Chicken Breast",
      "A lean and tender cut of white meat that comes from the chest of the chicken. It can be grilled whole, in pieces, or on skewers. It can be marinated with different sauces and spices for extra flavor.",
      categories[2],
      0.75
    ),
    itemCreate(
      "Salmon",
      "A healthy and flavorful seafood that can be grilled in fillets with a sweet and tangy glaze made of brown sugar, Dijon mustard, rice vinegar, and soy sauce.",
      categories[3],
      3.75
    ),
    itemCreate(
      "Lamb Shoulder Chops",
      "A fatty and flavorful cut of meat that comes from the shoulder of the lamb. It can be grilled, broiled, or pan-fried, but it can also stand up to longer, slower cooking methods like braising.",
      categories[4],
      1.75
    ),
  ]);
}

main().catch((err) => console.log(err));
