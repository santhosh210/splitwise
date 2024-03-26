const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
