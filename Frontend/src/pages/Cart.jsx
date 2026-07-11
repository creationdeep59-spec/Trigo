import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Cart = () => {
  const { items, restaurantName, addItem, decreaseItem, itemsTotal, restaurantId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = items.length ? 25 : 0;
  const taxes = Math.round(itemsTotal * 0.05);
  const grandTotal = itemsTotal + deliveryFee + taxes;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <ShoppingBag size={48} className="text-ink/20" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Your cart is empty</h2>
        <p className="mt-1 text-muted">Add dishes from a restaurant to start an order.</p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-chili px-6 py-3 text-sm font-bold text-white hover:bg-chili-dark"
        >
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Your cart</h1>
      <p className="mt-1 text-sm text-muted">Ordering from {restaurantName}</p>

      <div className="mt-6 divide-y divide-ink/5 rounded-xl2 border border-ink/5 bg-white">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-ink">{item.name}</p>
              <p className="text-sm text-muted">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-chili bg-chili-light px-2 py-1.5">
              <button onClick={() => decreaseItem(item.name)}>
                <Minus size={15} className="text-chili-dark" />
              </button>
              <span className="text-sm font-bold text-chili-dark">{item.quantity}</span>
              <button onClick={() => addItem(item, restaurantId, restaurantName)}>
                <Plus size={15} className="text-chili-dark" />
              </button>
            </div>
          </div>
        ))}
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

      <button
        onClick={handleCheckout}
        className="mt-6 w-full rounded-xl bg-chili py-3.5 text-sm font-bold text-white transition hover:bg-chili-dark"
      >
        Proceed to checkout
      </button>
    </div>
  );
};

export default Cart;
