import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group block overflow-hidden rounded-xl2 border border-ink/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        {restaurant.offer && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white">
            {restaurant.offer}
          </span>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-basil">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-basil" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-basil" />
          </span>
          Live
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-ink line-clamp-1">
            {restaurant.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-basil-light px-1.5 py-0.5 text-xs font-bold text-basil">
            <Star size={12} fill="currentColor" />
            {restaurant.rating?.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-muted">{restaurant.cuisine?.join(", ")}</p>
        <div className="mt-3 flex items-center justify-between text-sm text-muted">
          <span>₹{restaurant.costForTwo} for two</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {restaurant.deliveryTimeMins} mins
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
