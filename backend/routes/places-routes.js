const express = require("express");
const router = express.Router();

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const { pid } = req.params;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === pid;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  res.json({ place: place });
});

router.get("/user/:uid", (req, res, next) => {
  const { uid } = req.params;
  const user = DUMMY_PLACES.find((p) => {
    return p.creator === uid;
  });
  if (!user) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json({ place: user });
});

module.exports = router;
