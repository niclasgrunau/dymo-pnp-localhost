const express = require("express");
const router = express.Router();
const Label = require("../models/labelModel");
const User = require("../models/userModel");
// Save a new label
router.post("/save", async (req, res) => {
  try {
    const {
      userId,
      name,
      text,
      fontStyle,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      textAlignment,
      verticalAlignment,
      isQRCodeUsed,
      url,
      shortenedUrl,
      createdAt,
    } = req.body;

    const label = new Label({
      user: userId,
      name,
      text,
      fontStyle,
      fontSize,
      isBold,
      isItalic,
      isUnderline,
      textAlignment,
      verticalAlignment,
      isQRCodeUsed,
      url,
      shortenedUrl,
      createdAt,
    });

    await label.save();

    await User.findByIdAndUpdate(userId, { $push: { labels: label._id } });

    res.status(201).json({ message: "Label saved successfully" });
  } catch (error) {
    console.error("Error saving label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Retrieve labels for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user and populate the 'labels' field to get the full label documents
    const user = await User.findById(userId).populate("labels");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.labels);
  } catch (error) {
    console.error("Error retrieving labels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:labelId", async (req, res) => {
  try {
    const labelId = req.params.labelId;

    // Remove the label from the user's labels array
    await User.findOneAndUpdate(
      { labels: labelId },
      { $pull: { labels: labelId } }
    );

    // Remove the label from the labels collection
    await Label.findByIdAndDelete(labelId);

    res.status(200).json({ message: "Label deleted successfully" });
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
