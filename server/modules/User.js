const mongoose = require("../modules/connection");

//Creating new user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Courses",
    },
  ],
});
const User = mongoose.model("User", userSchema);

module.exports = User;
