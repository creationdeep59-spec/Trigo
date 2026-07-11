import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    restaurantName: String,
    items: [orderItemSchema],
    deliveryAddress: {
      label: String,
      line1: String,
      city: String,
      lat: Number,
      lng: Number,
    },
    itemsTotal: Number,
    deliveryFee: { type: Number, default: 25 },
    taxes: Number,
    grandTotal: Number,
    paymentMethod: { type: String, enum: ["COD", "UPI", "CARD"], default: "COD" },
    status: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    cancelReason: String,
    estimatedDeliveryTime: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
