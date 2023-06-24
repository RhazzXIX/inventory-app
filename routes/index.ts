import { Handler } from "express";
import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
} as Handler);

module.exports = router;
