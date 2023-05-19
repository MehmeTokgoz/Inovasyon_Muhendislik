const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//Connection to database

mongoose.set("strictQuery", false);

const connect = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db "))
  .catch((error) => console.log(error));

module.exports = mongoose;