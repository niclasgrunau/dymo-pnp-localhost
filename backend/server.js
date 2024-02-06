const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const dbUrl = `mongodb+srv://grunauniclas:${process.env.DB_PASSWORD}@cluster0.2t85nrt.mongodb.net/bpmprak?retryWrites=true&w=majority`;
console.log(dbUrl);

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB du hund");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const labelRoutes = require("./routes/labelRoutes");
app.use("/labels", labelRoutes);

const imageRoutes = require("./routes/imageRoutes");
app.use("/image", imageRoutes);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
