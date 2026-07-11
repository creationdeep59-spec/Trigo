import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => /^[0-9]{10}$/.test(value);

/**
 * @route   POST /api/users/register
 * @desc    Register with name, (email OR phone), password
 */
router.post("/register", async (req, res) => {
  try {
    const { name, identifier, password } = req.body;

    if (!name || !identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const query = {};
    let userData = { name, password };

    if (isEmail(identifier)) {
      query.email = identifier.toLowerCase();
      userData.email = identifier.toLowerCase();
    } else if (isPhone(identifier)) {
      query.phone = identifier;
      userData.phone = identifier;
    } else {
      return res.status(400).json({ message: "Enter a valid email or 10-digit phone number" });
    }

    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(409).json({ message: "Account already exists, please log in" });
    }

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login with (email OR phone) + password
 */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const query = isEmail(identifier)
      ? { email: identifier.toLowerCase() }
      : { phone: identifier };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "No account found with these details" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user's profile
 */
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

/**
 * @route   PUT /api/users/me
 * @desc    Update profile (name/avatar)
 */
router.put("/me", protect, async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { ...(name && { name }), ...(avatar && { avatar }) } },
    { new: true }
  ).select("-password");
  res.json(user);
});

/**
 * @route   POST /api/users/me/addresses
 * @desc    Add a delivery address / location
 */
router.post("/me/addresses", protect, async (req, res) => {
  const { label, line1, city, state, pincode, lat, lng, isDefault } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push({ label, line1, city, state, pincode, lat, lng, isDefault });
  await user.save();
  res.status(201).json(user.addresses);
});

/**
 * @route   DELETE /api/users/me/addresses/:addressId
 */
router.delete("/me/addresses/:addressId", protect, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.addresses = user.addresses.filter(
    (a) => a._id.toString() !== req.params.addressId
  );
  await user.save();
  res.json(user.addresses);
});

export default router;
