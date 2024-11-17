const mongoose = require("mongoose");
const { v4 } = require("uuid");
const CommentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: v4(),
  },
  user_id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    require: true,
  },
  created_at: {
    type: String,
  },
});

const comments = mongoose.model("comments", CommentSchema);
module.exports = comments;
