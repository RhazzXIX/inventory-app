import { Handler } from "express";
import express from 'express'

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
} as Handler);

module.exports = router;
