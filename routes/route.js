const express = require("express");
const router = express.Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const authRoutes = require("../api/auth");
const contactRoutes = require("../api/contacts");


// Use the imported handlers as middleware
router.use("/auth", authRoutes); // Example route for auth
router.use("/contacts", contactRoutes); // Assuming you want to protect this route



// // Multer configuration for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage }).single("image");

// // Middleware to verify token
// function verifyToken(req, res, next) {
//   const token =
//     req.headers.authorization && req.headers.authorization.split(" ")[1];
//   if (!token)
//     return res
//       .status(401)
//       .json({ message: "Access denied. Token is missing." });
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(400).json({ message: "Invalid token." });
//     req.userId = decoded.id;
//     next();
//   });
// }

// // Signup route
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     const newUser = new User({ name, email, phone, password });
//     await newUser.save();
//     res.json({ message: "User created successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Login route
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ message: "Authentication failed" });
//     const isPasswordValid = await user.isValidPassword(password);
//     if (!isPasswordValid)
//       return res.status(401).json({ message: "Authentication failed" });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Protected route
// router.get("/protected", verifyToken, async (req, res) => {
//   try {
//     res.json({ message: "Access granted. You are authenticated." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Insert a user to the database
// router.post("/add", upload, async (req, res) => {
//   try {
//     const newUser = new User({
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       image: req.file ? req.file.filename : null,
//     });
//     await newUser.save();
//     req.session.message = {
//       type: "success",
//       message: "User added successfully",
//     };
//     res.redirect("/");
//   } catch (err) {
//     res.status(500).json({ message: err.message, type: "danger" });
//   }
// });

// // Get all users
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//     // res.render("index", { title: "HOME PAGE", users: users });
//   } catch (err) {
//     res.status(500).json({ message: err.message, type: "danger" });
//   }
// });

// // Render add user page
// router.get("/add", (req, res) => {
//   res.render("add_user", { title: "Add Users" });
// });

// // Edit user route
// router.get("/edit/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await User.findById(id).exec();
//     if (!user) {
//       return res.redirect("/");
//     }
//     res.render("edit_users", { title: "Edit User", user: user });
//   } catch (err) {
//     res.status(500).json({ message: err.message, type: "danger" });
//   }
// });

// // Update user route
// router.post("/update/:id", upload, async (req, res) => {
//   try {
//     const id = req.params.id;
//     let newImage = req.body.old_image;

//     if (req.file) {
//       newImage = req.file.filename;
//       try {
//         fs.unlinkSync("./uploads/" + req.body.old_image);
//       } catch (err) {
//         console.log(err);
//       }
//     }

//     const result = await User.findByIdAndUpdate(id, {
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       image: newImage,
//     });
//     if (!result) {
//       return res.redirect("/");
//     }
//     req.session.message = {
//       type: "success",
//       message: "User updated successfully",
//     };
//     res.redirect("/");
//   } catch (err) {
//     res.status(500).json({ message: err.message, type: "danger" });
//   }
// });

// // Delete user route
// router.get("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   User.findByIdAndRemove(id, (err, result) => {
//     if (result && result.image) {
//       try {
//         fs.unlinkSync("./uploads/" + result.image);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//     if (err) {
//       res.status(500).json({ message: err.message });
//     } else {
//       req.session.message = {
//         type: "info",
//         message: "User deleted successfully",
//       };
//       res.redirect("/");
//     }
//   });
// });

module.exports = router;
