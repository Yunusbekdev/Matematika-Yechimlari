const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  pic: {
    type: String,
  },
  category_id: {
    type: String,
  },
});

const products = mongoose.model("products", ProductSchema);
module.exports = products;
