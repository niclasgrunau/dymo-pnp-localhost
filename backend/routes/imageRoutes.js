const express = require("express");
const router = express.Router();
const html2canvas = require("html2canvas");
const { JSDOM } = require("jsdom");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

let canvasWidth;

router.post("/generate-image", async (req, res) => {
  try {
    const { text, fontSize, isBold, isItalic, isUnderline } = req.body;

    // Create a virtual DOM using jsdom
    const dom = new JSDOM();
    const virtualDocument = dom.window.document;

    // Create a span element to render the text
    const span = virtualDocument.createElement("span");
    span.style.fontSize = `${fontSize}px`;
    span.style.fontWeight = isBold ? "bold" : "normal";
    span.style.fontStyle = isItalic ? "italic" : "normal";
    span.style.textDecoration = isUnderline ? "underline" : "none";
    span.innerText = text;

    // Create a div element to contain the span
    const div = virtualDocument.createElement("div");
    div.appendChild(span);

    // Use html2canvas to capture the content of the div
    const canvas = await html2canvas(div, { width: 452, height: 70 });

    const dataUrl = canvas.toDataURL("image/png");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Disposition": "attachment;filename=customizedText.png",
      "Content-Length": dataUrl.length,
    });
    res.end(dataUrl);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/saveImage", (req, res) => {
  console.log(`2. image download (server) ${new Date().toISOString()}`);

  try {
    const imageData = req.body.imageData; // Pass the base64 image data from the client
    canvasWidth = req.body.canvasWidth;
    const fileName = "DYMOPNP_label.png"; // Specify the desired file name

    const filePath = path.join(__dirname, "..", "downloads", fileName);

    // Convert base64 to binary data
    const imageBuffer = Buffer.from(imageData, "base64");

    // Save the image to the specified path
    fs.writeFileSync(filePath, imageBuffer);

    res.status(200).json({ message: "Image saved successfully" });
    console.log(`3. image saved ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  console.log(`4. saveImage post fertig ${new Date().toISOString()}`);
});

router.post("/resize", (req, res) => {
  console.log(`8. resize aufgerufen (server) ${new Date().toISOString()}`);
  try {
    // Execute terminal command using the say command
    const imagePath = path.join(__dirname, "..", "downloads/DYMOPNP_label.png");
    const outputPath = path.join(__dirname, "..", "downloads/output.pdf");

    let canvasWidthPrintingSite = 2 * Math.floor(canvasWidth / 2.91666667);

    // Execute the terminal command using the convert command
    exec(
      `convert ${imagePath} -page ${canvasWidthPrintingSite}x48 ${outputPath}`,
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

router.post("/download-command", (req, res) => {
  console.log(
    `14. downloads-command aufgerufen (server) ${new Date().toISOString()}`
  );
  try {
    const imagePath = path.join(__dirname, "..", "downloads/output.pdf");

    console.log("Canvas width:", canvasWidth);

    let canvasWidthPrintingSite = Math.floor(canvasWidth / 2.91666667); //this doesnt affect werid scale

    console.log("Canvas width resized:", canvasWidthPrintingSite);
    console.log(`PageSize=w35h${canvasWidthPrintingSite}`);
    console.log(`PageSize=Custom.35x${canvasWidthPrintingSite}`);

    // const execCommand = `lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=w35h252 -o fit-to-page ${imagePath}`;
    //const execCommand = `lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=Custom.24x173 -o fit-to-page ${imagePath}`; //doesnt affect if mm or points
    const execCommand = `lp -d DYMO_LabelManager_PnP -o landscape -o PageSize=Custom.24x${canvasWidthPrintingSite} -o fit-to-page ${imagePath}`;

    // console.log("Executing command:", execCommand);

    // Execute the terminal command using the say command
    exec(
      execCommand,
      //`say "hello"`,
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
