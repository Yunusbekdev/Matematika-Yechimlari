const mongoose = require("mongoose");
const { MONGO_URL } = require("../../config");

// import models ...
require("./Users");
require("./Categories");
require("./Admins");
require("./Orders");

module.exports = async function () {
  try {
    mongoose
      .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("Database connected!"))
      .catch((err) => console.error("Database connection error:", err));
  } catch (err) {
    console.log("Mongoose Error", err + "");
  }
};
