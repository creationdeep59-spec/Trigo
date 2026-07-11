import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  veg: { type: Boolean, default: true },
  category: String, // Starters, Main Course, Desserts...
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: [String],
    image: String,
    rating: { type: Number, default: 4.0 },
    costForTwo: Number,
    deliveryTimeMins: { type: Number, default: 30 },
    isPromoted: { type: Boolean, default: false },
    offer: String,
    location: {
      address: String,
      city: String,
      lat: Number,
      lng: Number,
    },
    menu: [menuItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
