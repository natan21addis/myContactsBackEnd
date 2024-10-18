const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration to allow requests from any origin
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific methods
  credentials: true, // Allow credentials (e.g., cookies)
  preflightContinue: false,
  optionsSuccessStatus: 204 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions)); // Use CORS middleware with options

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

// Middleware for serving static files
app.use(express.static("public"));
app.use(express.static("uploads"));

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Import your routes here after connection
    app.use("/", require("./routes/route")); 

    // Start the server only after successful connection
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Middleware to handle session messages
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
