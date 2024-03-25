const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
  },
  otp: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

const userValidationSchema = Joi.object({
  phone: Joi.string(),
  otp: Joi.string(),
});

module.exports = {
  User,
  validateUser: (user) => userValidationSchema.validate(user),
};
