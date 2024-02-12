const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Defining the schema for the user model

const UserSchema = new Schema({
  // Name of the user
  name: {
    type: String,
    required: true,
  },
  // Email address of the user
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password of the user
  password: {
    type: String,
    required: true,
  },
  // Array of labels associated with the user
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Label",
    },
  ],
});

// Creating the User model from the schema
const User = mongoose.model("users", UserSchema);

module.exports = User;
