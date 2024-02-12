const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Define MongoDB connection URL
const dbUrl = `mongodb+srv://grunauniclas:idontcare420@cluster0.2t85nrt.mongodb.net/bpmprak?retryWrites=true&w=majority`;
console.log(dbUrl);

// Connect to MongoDB database
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Create express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Import and use user / label / image routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const labelRoutes = require("./routes/labelRoutes");
app.use("/labels", labelRoutes);

const imageRoutes = require("./routes/imageRoutes");
app.use("/image", imageRoutes);

// Serve static files from frontend build directory
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Handle all other routes by serving the frontend's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 6982;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
