import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Restaurant from "./models/Restaurant.js";

dotenv.config();
await connectDB();

const demoRestaurants = [
  {
    name: "Kolkata@99",
    cuisine: ["North Indian", "Mughlai", "Desserts"],
    image: "https://images.unsplash.com/photo-1667489022797-ab608913feeb?w=800",
    rating: 4.4,
    costForTwo: 450,
    deliveryTimeMins: 28,
    isPromoted: true,
    offer: "50% OFF up to ₹100",
    location: { address: "GS Road", city: "Guwahati", lat: 26.1445, lng: 91.7362 },
    menu: [
  { name: "Butter Chicken", price: 320, veg: false, category: "Main Course", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400" },
  { name: "Paneer Tikka", price: 260, veg: true, category: "Starters", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
  { name: "Garlic Naan", price: 60, veg: true, category: "Breads", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400" },
  { name: "Vanilla Ice Cream", price: 90, veg: true, category: "Desserts", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400" },
  { name: "Chocolate Ice Cream", price: 100, veg: true, category: "Desserts", image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=400" },
    ],
  },
  {
    name: "Bamboo Bowl Noodle Bar",
    cuisine: ["Chinese", "Asian"],
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
    rating: 4.2,
    costForTwo: 350,
    deliveryTimeMins: 22,
    isPromoted: false,
    offer: "Free delivery",
    location: { address: "Zoo Road", city: "Guwahati", lat: 26.1584, lng: 91.7797 },
    menu: [
      { name: "Veg Hakka Noodles", price: 180, veg: true, category: "Noodles", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=400" },
      { name: "Chilli Chicken", price: 240, veg: false, category: "Starters", image: "https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=400" },
    ],
  },
  {
    name: "Pizza Piazza",
    cuisine: ["Italian", "Pizza"],
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    rating: 4.6,
    costForTwo: 500,
    deliveryTimeMins: 30,
    isPromoted: true,
    offer: "Buy 1 Get 1 Free",
    location: { address: "Fancy Bazar", city: "Guwahati", lat: 26.1867, lng: 91.7458 },
    menu: [
      { name: "Margherita Pizza", price: 280, veg: true, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400" },
      { name: "Farmhouse Pizza", price: 340, veg: true, category: "Pizza", image: "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400" },
    ],
  },
];

const run = async () => {
  await Restaurant.deleteMany({});
  await Restaurant.insertMany(demoRestaurants);
  console.log("✅ Demo restaurants seeded");
  process.exit();
};

run();
