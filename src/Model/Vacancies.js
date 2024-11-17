const mongoose = require("mongoose");

const VacancySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  vacany: {
    type: String,
  },
  phone_number: {
    type: Number,
  },
  city: {
    type: String,
  },
  goal: {
    type: String,
  },
});

const vacancies = mongoose.model("vacancies", VacancySchema);
module.exports = vacancies;
