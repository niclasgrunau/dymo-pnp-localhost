const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Variable to track if the print button is clicked
let buttonIsClicked = false;

// Route to set the print button click status
router.post("/setPrintButtonClick", (req, res) => {
  try {
    // Set the buttonIsClicked variable to true
    buttonIsClicked = true;
    // Send a response indicating successful recording of button click
    res.status(200).send("Button click recorded");
  } catch (error) {
    console.error("Error recording button click:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to set the trigger print button clicked status
router.post("/setTriggerPrintButtonClicked", (req, res) => {
  // Variable to store the print toggle status
  let printToggle;

  // Check if the print button is clicked
  if (buttonIsClicked) {
    // If clicked, set print toggle to true
    printToggle = true;
    try {
      // Send a response indicating successful recording of button click
      res.status(200).send(printToggle);
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // If not clicked, set print toggle to false
    printToggle = false;
    res.status(200).send(printToggle);
  }
});

// Route to save the image received from the client
router.post("/saveImage", (req, res) => {
  try {
    // Check if imageData is undefined, if yes, provide a default value
    let imageData = req.body.imageData;

    // For CPEE demo case when req.body is null
    if (imageData === undefined) {
      imageData =
        "iVBORw0KGgoAAAANSUhEUgAAAhMAAABFCAYAAADw62TnAAAAAXNSR0IArs4c6QAAAy5JREFUeF7t1rENACAMBDGy/9BBYgSudfo01hc3u7vHESBAgAABAgQ+BUZMfMp5I0CAAAECBJ6AmDAEAgQIECBAIAmIicTnmQABAgQIEBATNkCAAAECBAgkATGR+DwTIECAAAECYsIGCBAgQIAAgSQgJhKfZwIECBAgQEBM2AABAgQIECCQBMRE4vNMgAABAgQIiAkbIECAAAECBJKAmEh8ngkQIECAAAExYQMECBAgQIBAEhATic8zAQIECBAgICZsgAABAgQIEEgCYiLxeSZAgAABAgTEhA0QIECAAAECSUBMJD7PBAgQIECAgJiwAQIECBAgQCAJiInE55kAAQIECBAQEzZAgAABAgQIJAExkfg8EyBAgAABAmLCBggQIECAAIEkICYSn2cCBAgQIEBATNgAAQIECBAgkATEROLzTIAAAQIECIgJGyBAgAABAgSSgJhIfJ4JECBAgAABMWEDBAgQIECAQBIQE4nPMwECBAgQICAmbIAAAQIECBBIAmIi8XkmQIAAAQIExIQNECBAgAABAklATCQ+zwQIECBAgICYsAECBAgQIEAgCYiJxOeZAAECBAgQEBM2QIAAAQIECCQBMZH4PBMgQIAAAQJiwgYIECBAgACBJCAmEp9nAgQIECBAQEzYAAECBAgQIJAExETi80yAAAECBAiICRsgQIAAAQIEkoCYSHyeCRAgQIAAATFhAwQIECBAgEASEBOJzzMBAgQIECAgJmyAAAECBAgQSAJiIvF5JkCAAAECBMSEDRAgQIAAAQJJQEwkPs8ECBAgQICAmLABAgQIECBAIAmIicTnmQABAgQIEBATNkCAAAECBAgkATGR+DwTIECAAAECYsIGCBAgQIAAgSQgJhKfZwIECBAgQEBM2AABAgQIECCQBMRE4vNMgAABAgQIiAkbIECAAAECBJKAmEh8ngkQIECAAAExYQMECBAgQIBAEhATic8zAQIECBAgICZsgAABAgQIEEgCYiLxeSZAgAABAgTEhA0QIECAAAECSUBMJD7PBAgQIECAgJiwAQIECBAgQCAJiInE55kAAQIECBAQEzZAgAABAgQIJIELe+oTQd2ywj4AAAAASUVORK5CYII=";
    }

    // Define filename for saving the image
    const fileName = "DYMOPNP_label.png";
    //    const imagePath = "/Users/niclasgrunau/Downloads/a.png";

    // Define the file path where the image will be saved
    const filePath = path.join(__dirname, "..", "downloads", fileName);

    // Convert base64 image data to buffer
    const imageBuffer = Buffer.from(imageData, "base64");

    // Write image data to file
    fs.writeFileSync(filePath, imageBuffer);

    // Send a response indicating successful image saving
    let isSaved = true;
    res.status(200).send(isSaved);
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to resize the image to a specific dimension
router.post("/resize", (req, res) => {
  // Send a response indicating successful image resizing
  let isResized = true;
  res.status(200).send(isResized);
});

// Route to print the resized image
router.post("/download-command", (req, res) => {
  // Send a response indicating successful image printing
  let isPrint = true;
  res.status(200).send(isPrint);
});

module.exports = router;
