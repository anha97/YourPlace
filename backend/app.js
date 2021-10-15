const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser"); // Allows you to read the upcoming request or body header
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// You need this to display images from backend to frontend
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// This is necessary for connection between frontend and backend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes); // => /api/places/...

app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
}); // This middleware is only reached if we have some requests that didn't get a response before and that can only be a request that we don't want to handle

// Will execute it for every requests (A special middleware that handles errors when throw or return next(err) in a specific route)
app.use((error, req, res, next) => {
  // If we got an error and has an image file, delete that image file
  if (req.file) {
    // req.file is from multer I think
    fs.unlink(req.file.path, (err) => {
      // This function will trigger after deletion
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bthzl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000); // If Mongoose is connected successfully, start the server
    console.log("Server is online!");
  })
  .catch((err) => console.log(err));
