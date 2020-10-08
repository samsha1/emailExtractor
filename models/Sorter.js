const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SorterSchema = new Schema({
  unique_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Sorter = mongoose.model("sorter", SorterSchema);
