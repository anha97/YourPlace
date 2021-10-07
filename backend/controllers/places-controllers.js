const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const { pid } = req.params;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === pid;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
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
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creator: creator,
  };

  DUMMY_PLACES.push(createdPlace); // unshift(createdPlace)

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const { pid } = req.params;
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === pid) }; // Find a place by id and copy it

  if (!updatedPlace) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  const placeIdx = DUMMY_PLACES.findIndex((p) => p.id === pid);

  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIdx] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const { pid } = req.params;

  const place = DUMMY_PLACES.find((p) => p.id === pid);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== pid);
  res.status(200).json({ message: "Deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
