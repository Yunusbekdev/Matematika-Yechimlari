const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
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

const orders = mongoose.model("orders", OrdersSchema);
module.exports = orders;
