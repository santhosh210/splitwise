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
  friendRequests: [
    {
      userId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
      },
    },
  ],
  friends: [
    {
      friendId: {
        type: String,
        unique: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
      },
    },
  ],
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

// const mongoose = require("mongoose");
// const Joi = require("joi");
// const userSchema = new mongoose.Schema({
//   phone: {
//     type: String,
//     unique: true,
//   },
//   otp: {
//     type: String,
//   },
//   friends: [
//     {
//       friendId: {
//         type: String,
//         unique: true,
//       },
//       status: {
//         type: String,
//         enum: ["pending", "accepted"],
//         default: "pending",
//       },
//     },
//   ],
//   friendRequests: [

//   ],
// });

// const User = mongoose.model("User", userSchema);

// const userValidationSchema = Joi.object({
//   phone: Joi.string(),
//   otp: Joi.string(),
// });

// module.exports = {
//   User,
//   validateUser: (user) => userValidationSchema.validate(user),
// };
