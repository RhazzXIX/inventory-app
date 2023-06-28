import { ErrorRequestHandler, Handler } from "express";
require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const homeRouter = require("./routes/home");
const stocksRouter = require("./routes/stocks");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require('express-rate-limit');

mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;

const app = express();

async function main() {
  await mongoose
    .connect(mongoDB)
    .then(() => console.log("connected to database"));
}

main().catch((err: Error) => console.log(err));

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20 
})

app.use(limiter);

// Compress all routes
app.use(compression());
// Use helmet for security
app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/home", homeRouter);
app.use("/stocks", stocksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
} as Handler);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
} as ErrorRequestHandler);

module.exports = app;
