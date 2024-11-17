const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  pic: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  count: {
    type: Number,
  },
  delivery: {
    type: Number,
  },
  date: {
    type: Number,
  },
});

const orders = mongoose.model("orders", OrdersSchema);
module.exports = orders;
