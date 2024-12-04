const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  step: {
    type: String,
    default: 0,
  },
  role: {
    type: String,
    default: "admin",
  },
});

const admins = mongoose.model("admins", AdminSchema);
module.exports = admins;
