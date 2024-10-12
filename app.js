// backend/app.js
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start the server only after successful connection
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });

    // Import your routes here after connection
    app.use("/", require("./routes/route")); 
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
