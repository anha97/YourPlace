const mongoose = require("mongoose");
// For some reason, this is causing an validation error after creating a new user, rendering the user's ability to create a place, delete, and so on...
// HOWEVER, apparently, mongoose added "unique" option, so you don't need mongoose-unique-validator at all...
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Need to install mongoose-unique-validator module
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
