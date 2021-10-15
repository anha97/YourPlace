const { validationResult } = require("express-validator");

// User Authetication
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  // Hashing/encrypting the password
  let hashedPw;
  try {
    hashedPw = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again."), 500);
  }

  const createdUser = new User({
    name: name,
    email: email,
    password: hashedPw,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    // jwt.sign(payload, secret_key, option)
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Invalid credentials, please try again.", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials, please try again.", 401));
  }

  let token;
  try {
    // jwt.sign(payload, secret_key, option)
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again.", 500));
  }

  res.json({
    userId: user.id,
    email: user.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
