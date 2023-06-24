import { Handler } from "express"

const express = require('express')

const router = express.Router()

router.get('/', function(req, res, next) {
  res.render('index.pug', {
    title: 'Ihawan Corner',
    adtnlCss: '/stylesheets/home.css'
  })
} as Handler);

module.exports = router;