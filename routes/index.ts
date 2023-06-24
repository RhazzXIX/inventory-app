import { Handler } from "express";
import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect('/home')
} as Handler);

module.exports = router;
