const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user.js");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // Takes all values but password
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }

  res.status(200).json({
    users: users.map((user) => {
      return user.toObject({ getters: true });
    }),
  });
};

const userSignup = async (req, res, next) => {
  const errors = validationResult(req); // Checks if there is any validation errors from the middleware

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (hasUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name: name,
    email: email,
    password: password,
    image:
      "https://images.unsplash.com/photo-1632877558001-92e30f4a6b65?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  if (!user || user.password !== password) {
    return next(new HttpError("Invalid credentials, please try again.", 401));
  }

  res.json({ message: "Logged in!", user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
