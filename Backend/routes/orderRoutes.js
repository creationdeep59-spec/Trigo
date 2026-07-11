import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders  -> place/book a new order
router.post("/", protect, async (req, res) => {
  try {
    const {
      restaurant,
      restaurantName,
      items,
      deliveryAddress,
      itemsTotal,
      deliveryFee,
      taxes,
      grandTotal,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const estimatedDeliveryTime = new Date(Date.now() + 35 * 60 * 1000);

    const order = await Order.create({
      user: req.userId,
      restaurant,
      restaurantName,
      items,
      deliveryAddress,
      itemsTotal,
      deliveryFee,
      taxes,
      grandTotal,
      paymentMethod,
      estimatedDeliveryTime,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
});

// GET /api/orders -> logged-in user's order history
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id -> live tracking for one order
router.get("/:id", protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// PUT /api/orders/:id/cancel -> cancellation system
router.put("/:id/cancel", protect, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.userId });
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].includes(order.status)) {
    return res.status(400).json({
      message: `Order cannot be cancelled once it is ${order.status.replace("_", " ").toLowerCase()}`,
    });
  }

  order.status = "CANCELLED";
  order.cancelReason = req.body.reason || "Cancelled by customer";
  await order.save();
  res.json(order);
});

export default router;
