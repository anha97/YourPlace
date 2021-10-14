const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // if the request's method is "OPTIONS", just return next(), preventing POST request to continue
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    // req.headers is provided by express
    const token = req.headers.authorization.split(" ")[1]; // Authorization: "Bearer TOKEN"; you will get an array of two values after splitting...
    if (!token) {
      throw new HttpError("Authentication failed!");
    }
    const decodedToken = jwt.verify(
      token,
      "supersecret_dont_share_with_anyone"
    );
    // jwt.sign(
    //   { userId: user.id, email: user.email },
    //   "supersecret_dont_share_with_anyone",
    //   { expiresIn: "1h" }
    // );
    // Since you store userId and email, you can use them to define a new variable for req to hold onto...
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
