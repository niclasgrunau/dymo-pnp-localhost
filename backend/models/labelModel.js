const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Defining the schema for the label model
const labelSchema = new Schema({
  // Reference to the user who created the label
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Name of the label
  name: {
    type: String,
    required: true,
  },
  // Text content of the label
  text: {
    type: String,
    required: false,
  },
  // Font style of the text
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
  // Font size of the text
  fontSize: {
    type: Number,
    required: true,
  },
  // Whether the text is bold
  isBold: {
    type: Boolean,
    required: true,
  },
  // Whether the text is italicized
  isItalic: {
    type: Boolean,
    required: true,
  },
  // Whether the text is underlined
  isUnderline: {
    type: Boolean,
    required: true,
  },
  // Text alignment (left, center, right)
  textAlignment: {
    type: String,
    enum: ["left", "center", "right"],
    default: "center",
    required: true,
  },
  // Vertical alignment (top, middle, bottom)
  verticalAlignment: {
    type: String,
    enum: ["top", "middle", "bottom"],
    default: "center",
    required: true,
  },
  // Whether a QR code is included in the label
  isQRCodeUsed: {
    type: Boolean,
    required: true,
  },
  // URL associated with the QR code
  url: {
    type: String,
    required: false,
  },
  // Shortened URL associated with the QR code
  shortenedUrl: {
    type: String,
    required: false,
  },
  // Timestamp for when the label was created
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Creating the Label model from the schema
const Label = mongoose.model("Label", labelSchema);

module.exports = Label;
