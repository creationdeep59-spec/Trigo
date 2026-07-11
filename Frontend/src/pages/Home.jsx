import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../Utilities/api.js";
import RestaurantCard from "../Components/RestaurantCard.jsx";
import { useLocation } from "../context/LocationContext.jsx";

const CATEGORIES = [
  { label: "Pizza", emoji: "🍕" },
  { label: "Biryani", emoji: "🍛" },
  { label: "Chinese", emoji: "🥡" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Desserts", emoji: "🍰" },
  { label: "South Indian", emoji: "🥘" },
  { label: "Rolls", emoji: "🌯" },
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const { location } = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/restaurants", { params: { search: activeCategory || urlSearch } })
      .then((res) => setRestaurants(res.data))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [urlSearch, activeCategory]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-turmeric">
              Delivering to {location?.label || "your city"}
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              What are you <span className="text-chili">craving</span> today?
            </h1>
            <p className="mt-4 max-w-md text-white/70">
              Order from thousands of local restaurants. Track it live, from the kitchen to your doorstep.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="relative mx-auto h-64 w-64">
              <div className="absolute inset-0 animate-pulseDot rounded-full bg-chili/20 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
                alt="Delicious food"
                className="relative h-64 w-64 rounded-full border-4 border-white/10 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory("")}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeCategory === ""
                ? "border-chili bg-chili-light text-chili-dark"
                : "border-ink/10 bg-white text-ink hover:border-chili/40"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCategory(c.label)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === c.label
                  ? "border-chili bg-chili-light text-chili-dark"
                  : "border-ink/10 bg-white text-ink hover:border-chili/40"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
          Restaurants to explore
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl2 bg-card" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-ink/15 bg-white p-10 text-center">
            <p className="font-display text-xl text-ink">No restaurants found</p>
            <p className="mt-1 text-sm text-muted">
              Try a different search, or run the backend seed script to load demo restaurants.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
