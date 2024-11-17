const mongoose = require("mongoose");
const { v4 } = require("uuid");

const CategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: v4(),
    unique: true,
  },
  name: {
    type: String,
  },
  category_id: {
    type: String,
  },
});

const categories = mongoose.model("categories", CategorySchema);
module.exports = categories;
