const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: ObjectId,
  username: String,
  password: String,
  profilePicture: String,
  firstName: String,
  lastName: String,
  gender: String,
  likedpersons: Array,
  beers: Object,
  age: Number,
  preferred_age: Object,
  preferred_gender: String,
});

module.exports = mongoose.model("User", userSchema);
