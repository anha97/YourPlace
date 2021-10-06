const express = require("express");
const bodyParser = require("body-parser"); // Allows you to read the upcoming request or body header

const placesRoutes = require("./routes/places-routes");

const app = express();

app.use("/api/places", placesRoutes); // => /api/places/...

// Will execute it for every requests (A special middleware that handles errors when throw or return next(err))
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(5000);
