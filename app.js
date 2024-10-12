require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors"); // Import CORS for cross-origin requests
const app = express();
const PORT = process.env.PORT || 4000; // Use process.env.PORT for dynamic port binding
mongoose.connect(process.env.DB_URI); // Add options to avoid deprecation warnings
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Set a secret for session management
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
app.use("/", require("./routes/route"));
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});