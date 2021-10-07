const express = require("express");
const bodyParser = require("body-parser"); // Allows you to read the upcoming request or body header

const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); // => /api/places/...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});  // This middleware is only reached if we have some requests that didn't get a response before and that can only be a request that we don't want to handle

// Will execute it for every requests (A special middleware that handles errors when throw or return next(err) in a specific route)
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);