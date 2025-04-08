// akash@growhut
// cc - nakul@growhut.in
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator"); // ✅ Fix typo
const User = require("./models/User");

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/myapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register User Route
app.post(
  "/api/users",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req); // ✅ Fix typo
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({
        userId: user._id,
        message: "User registered successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
