const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Route to save the image received from the client
router.post("/saveImage", (req, res) => {
  console.log(`2. image download (server) ${new Date().toISOString()}`);

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

    // Define the file path where the image will be saved
    const filePath = path.join(__dirname, "..", "downloads", fileName);

    // Convert base64 image data to buffer
    const imageBuffer = Buffer.from(imageData, "base64");

    // Write image data to file
    fs.writeFileSync(filePath, imageBuffer);

    res.status(200).json({ message: "Image saved successfully" });
    console.log(`3. image saved ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  console.log(`4. saveImage post fertig ${new Date().toISOString()}`);
});

// Route to resize the image to a specific dimension
router.post("/resize", (req, res) => {
  console.log(`8. resize aufgerufen (server) ${new Date().toISOString()}`);
  try {
    // Define input and output file paths
    const imagePath = path.join(__dirname, "..", "downloads/DYMOPNP_label.png");
    const outputPath = path.join(__dirname, "..", "downloads/output.pdf");

    // Execute image resize command using ImageMagick
    exec(
      `convert ${imagePath} -page 531x69 ${outputPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log(`Command output: ${stdout}`);
        res.json({ message: "Command executed successfully" });
      }
    );
    console.log(`9. output gesichert ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Error executing command:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(`10. resize post fertig ${new Date().toISOString()}`);
});

// Route to print the resized image
router.post("/download-command", (req, res) => {
  console.log(
    `14. downloads-command aufgerufen (server) ${new Date().toISOString()}`
  );
  try {
    // Define the path of the resized image
    const imagePath = path.join(__dirname, "..", "downloads/output.pdf");

    // Execute print command using CUPS
    exec(
      `lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=w35h252 -o fit-to-page ${imagePath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log(`Command output: ${stdout}`);
        res.json({ message: "Command executed successfully" });
      }
    );
    console.log(`15. geprintet ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Error executing command:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log(`16. geprintet fertig ${new Date().toISOString()}`);
});

module.exports = router;
