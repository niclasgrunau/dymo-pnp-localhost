const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const labelSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  fontStyle: {
    type: String,
    enum: [
      "Helvetica",
      "Arial",
      "Times New Roman",
      "Verdana",
      "Calibri",
      "Arial Narrow",
      "Comic Sans MS",
      "Roboto",
    ],
    default: "Arial",
    required: true,
  },
  fontSize: {
    type: Number,
    required: true,
  },
  isBold: {
    type: Boolean,
    required: true,
  },
  isItalic: {
    type: Boolean,
    required: true,
  },
  isUnderline: {
    type: Boolean,
    required: true,
  },
  textAlignment: {
    type: String,
    enum: ["left", "center", "right"],
    default: "center",
    required: true,
  },
  verticalAlignment: {
    type: String,
    enum: ["top", "middle", "bottom"],
    default: "center",
    required: true,
  },
  isQRCodeUsed: {
    type: Boolean,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  shortenedUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Label = mongoose.model("Label", labelSchema);

module.exports = Label;
