import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Wallet, CreditCard, Banknote } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useLocation } from "../context/LocationContext.jsx";
import api from "../Utilities/api.js";

const PAYMENT_METHODS = [
  { id: "COD", label: "Cash on Delivery", icon: Banknote },
  { id: "UPI", label: "UPI", icon: Wallet },
  { id: "CARD", label: "Credit / Debit Card", icon: CreditCard },
];

const Checkout = () => {
  const { items, restaurantId, restaurantName, itemsTotal, clearCart } = useCart();
  const { location } = useLocation();
  const navigate = useNavigate();

  const [payment, setPayment] = useState("COD");
  const [addressLine, setAddressLine] = useState(location?.label || "");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = 25;
  const taxes = Math.round(itemsTotal * 0.05);
  const grandTotal = itemsTotal + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    if (!addressLine.trim()) {
      setError("Please add a delivery address");
      return;
    }
    setError("");
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        restaurant: restaurantId,
        restaurantName,
        items: items.map(({ name, price, quantity }) => ({ name, price, quantity })),
        deliveryAddress: {
          label: "Delivery address",
          line1: addressLine,
          city: location?.label,
          lat: location?.lat,
          lng: location?.lng,
        },
        itemsTotal,
        deliveryFee,
        taxes,
        grandTotal,
        paymentMethod: payment,
      });
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-muted">
        Your cart is empty — nothing to check out.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Checkout</h1>

      <div className="mt-6 rounded-xl2 border border-ink/5 bg-white p-5">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <MapPin size={18} className="text-chili" /> Delivery address
        </h2>
        <textarea
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          rows={2}
          placeholder="House no, street, landmark..."
          className="w-full rounded-lg border border-ink/10 p-3 text-sm outline-none focus:border-chili"
        />
      </div>

      <div className="mt-6 rounded-xl2 border border-ink/5 bg-white p-5">
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Payment method</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                payment === m.id ? "border-chili bg-chili-light" : "border-ink/10"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === m.id}
                onChange={() => setPayment(m.id)}
                className="accent-chili"
              />
              <m.icon size={17} className="text-ink" />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2 rounded-xl2 border border-ink/5 bg-white p-5 text-sm">
        <div className="flex justify-between text-muted">
          <span>Item total</span>
          <span>₹{itemsTotal}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Delivery fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Taxes & charges</span>
          <span>₹{taxes}</span>
        </div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-bold text-ink">
          <span>To pay</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-chili-light px-3 py-2 text-sm text-chili-dark">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="mt-6 w-full rounded-xl bg-chili py-3.5 text-sm font-bold text-white transition hover:bg-chili-dark disabled:opacity-60"
      >
        {placing ? "Placing your order…" : `Place order · ₹${grandTotal}`}
      </button>
    </div>
  );
};

export default Checkout;
