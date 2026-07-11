import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Bike } from "lucide-react";
import api from "../Utilities/api.js";

const STEPS = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
const STEP_LABELS = {
  PLACED: "Order placed",
  CONFIRMED: "Confirmed by restaurant",
  PREPARING: "Preparing your food",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [reason, setReason] = useState("");

  const fetchOrder = () => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    // simulate a live-tracking poll, same idea as Swiggy/Zomato's live tracker
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`, { reason });
      setOrder(data);
      setShowReasonBox(false);
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't cancel this order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">Loading order…</div>;
  if (!order) return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">Order not found.</div>;

  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";
  const canCancel = ["PLACED", "CONFIRMED", "PREPARING"].includes(order.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-xl2 border border-ink/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">{order.restaurantName}</h1>
            <p className="text-sm text-muted">Order #{order._id.slice(-6).toUpperCase()}</p>
          </div>
          {isCancelled ? (
            <span className="flex items-center gap-1 rounded-full bg-chili-light px-3 py-1 text-xs font-bold text-chili-dark">
              <XCircle size={14} /> Cancelled
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-basil-light px-3 py-1 text-xs font-bold text-basil">
              <Bike size={14} /> {STEP_LABELS[order.status]}
            </span>
          )}
        </div>

        {!isCancelled && (
          <div className="mt-8">
            <div className="relative flex justify-between">
              <div className="absolute left-0 top-3 h-0.5 w-full bg-ink/10" />
              <div
                className="absolute left-0 top-3 h-0.5 bg-basil transition-all duration-700"
                style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
              />
              {STEPS.map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2 text-center" style={{ width: 70 }}>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      i <= currentStepIndex
                        ? "border-basil bg-basil text-white"
                        : "border-ink/15 bg-white text-ink/30"
                    }`}
                  >
                    {i <= currentStepIndex && <CheckCircle2 size={14} />}
                  </div>
                  <span className="text-[11px] leading-tight text-muted">{STEP_LABELS[step]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCancelled && order.cancelReason && (
          <p className="mt-6 rounded-lg bg-chili-light px-4 py-3 text-sm text-chili-dark">
            Reason: {order.cancelReason}
          </p>
        )}

        <div className="mt-8 divide-y divide-ink/5 border-t border-ink/5">
          {order.items.map((item) => (
            <div key={item.name} className="flex justify-between py-3 text-sm">
              <span className="text-ink">
                {item.quantity} × {item.name}
              </span>
              <span className="text-muted">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 text-base font-bold text-ink">
          <span>Total paid</span>
          <span>₹{order.grandTotal}</span>
        </div>

        {canCancel && (
          <div className="mt-6">
            {!showReasonBox ? (
              <button
                onClick={() => setShowReasonBox(true)}
                className="w-full rounded-xl border border-chili py-3 text-sm font-bold text-chili-dark transition hover:bg-chili-light"
              >
                Cancel order
              </button>
            ) : (
              <div className="rounded-xl border border-chili/30 bg-chili-light p-4">
                <p className="mb-2 text-sm font-semibold text-chili-dark">Why are you cancelling?</p>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Ordered by mistake"
                  className="w-full rounded-lg border border-chili/30 px-3 py-2 text-sm outline-none"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 rounded-lg bg-chili py-2 text-sm font-bold text-white hover:bg-chili-dark disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling…" : "Confirm cancellation"}
                  </button>
                  <button
                    onClick={() => setShowReasonBox(false)}
                    className="flex-1 rounded-lg border border-ink/10 py-2 text-sm font-semibold text-ink"
                  >
                    Keep order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Link to="/orders" className="mt-4 block text-center text-sm font-semibold text-chili hover:underline">
        View all orders
      </Link>
    </div>
  );
};

export default OrderTracking;
