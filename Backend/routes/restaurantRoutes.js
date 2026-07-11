import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// GET /api/restaurants?city=Guwahati&search=biryani
router.get("/", async (req, res) => {
  try {
    const { city, search } = req.query;
    const filter = {};
    if (city) filter["location.city"] = new RegExp(city, "i");
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { cuisine: new RegExp(search, "i") },
      ];
    }
    const restaurants = await Restaurant.find(filter).sort({ isPromoted: -1, rating: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants", error: error.message });
  }
});

// GET /api/restaurants/:id
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurant", error: error.message });
  }
});

// POST /api/restaurants (seed/admin use)
router.post("/", async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Failed to create restaurant", error: error.message });
  }
});

export default router;
