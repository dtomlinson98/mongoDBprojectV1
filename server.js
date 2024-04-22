require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;
const axios = require("axios");

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", require("./routes/root"));

// Insert states from statesData.json into MongoDB
const insertStatesFromJson =
  require("./controllers/statesController").insertStatesFromJson;
insertStatesFromJson();

app.use("/states", require("./routes/api/states"));

// 404 handler
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

// Function to post states data to the server
const postDataToServer = async () => {
  try {
    // Load the states data from statesData.json
    const statesData = require("./model/statesData.json");
    // Loop through each state in the statesData array
    for (const state of statesData) {
      // Post the state data to the server
      const response = await axios.post(
        `http://localhost:${PORT}/states`,
        state
      );
      console.log(`Posted state ${state.state} successfully!`);
    }
  } catch (error) {
    console.error("Error posting data:", error.message);
  }
};

// Post the states data when the server starts
postDataToServer();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
