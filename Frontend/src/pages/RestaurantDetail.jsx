import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Plus, Minus, Leaf } from "lucide-react";
import api from "../Utilities/api.js";
import { useCart } from "../context/CartContext.jsx";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { items, addItem, decreaseItem } = useCart();

  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const quantityOf = (name) => items.find((i) => i.name === name)?.quantity || 0;

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted">Loading menu…</div>;
  }
  if (!restaurant) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted">Restaurant not found.</div>;
  }

  const categories = [...new Set(restaurant.menu.map((m) => m.category))];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="overflow-hidden rounded-xl2 border border-ink/5 bg-white shadow-sm">
        <img src={restaurant.image} alt={restaurant.name} className="h-56 w-full object-cover" />
        <div className="p-6">
          <h1 className="font-display text-3xl font-bold text-ink">{restaurant.name}</h1>
          <p className="mt-1 text-muted">{restaurant.cuisine?.join(", ")}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1 rounded-md bg-basil-light px-2 py-1 font-bold text-basil">
              <Star size={13} fill="currentColor" /> {restaurant.rating?.toFixed(1)}
            </span>
            <span className="flex items-center gap-1 text-muted">
              <Clock size={15} /> {restaurant.deliveryTimeMins} mins
            </span>
            <span className="text-muted">₹{restaurant.costForTwo} for two</span>
          </div>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">{cat}</h2>
          <div className="divide-y divide-ink/5 rounded-xl2 border border-ink/5 bg-white">
            {restaurant.menu
              .filter((m) => m.category === cat)
              .map((item) => {
                const qty = quantityOf(item.name);
                return (
                  <div key={item.name} className="flex items-center gap-4 p-4">
                    <span
                      className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 ${
                        item.veg ? "border-basil" : "border-chili"
                      }`}
                    >
                      <Leaf
                        size={9}
                        className={item.veg ? "text-basil" : "text-chili"}
                        fill="currentColor"
                      />
                    </span>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{item.name}</p>
                      <p className="text-sm text-muted">₹{item.price}</p>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-muted line-clamp-1">{item.description}</p>
                      )}
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addItem(item, restaurant._id, restaurant.name)}
                        className="rounded-lg border border-chili bg-chili-light px-4 py-2 text-sm font-bold text-chili-dark transition hover:bg-chili hover:text-white"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-chili bg-chili-light px-2 py-1.5">
                        <button onClick={() => decreaseItem(item.name)}>
                          <Minus size={15} className="text-chili-dark" />
                        </button>
                        <span className="text-sm font-bold text-chili-dark">{qty}</span>
                        <button onClick={() => addItem(item, restaurant._id, restaurant.name)}>
                          <Plus size={15} className="text-chili-dark" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantDetail;
