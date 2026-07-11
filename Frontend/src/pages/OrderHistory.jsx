import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../Utilities/api.js";

const STATUS_STYLES = {
  DELIVERED: "bg-basil-light text-basil",
  CANCELLED: "bg-chili-light text-chili-dark",
  DEFAULT: "bg-turmeric-light text-turmeric",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-muted">Loading orders…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">My orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl2 border border-dashed border-ink/15 bg-white p-10 text-center">
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-chili px-6 py-2.5 text-sm font-bold text-white">
            Order now
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/orders/${o._id}`}
              className="block rounded-xl2 border border-ink/5 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">{o.restaurantName}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    STATUS_STYLES[o.status] || STATUS_STYLES.DEFAULT
                  }`}
                >
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
              </p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted">{new Date(o.createdAt).toLocaleString()}</span>
                <span className="font-semibold text-ink">₹{o.grandTotal}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
