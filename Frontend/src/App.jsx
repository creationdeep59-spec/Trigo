import { Routes, Route } from "react-router-dom";
import Navigationbar from "./Components/Navigationbar.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Footer from "./Components/Footer.jsx";
import PrivateRoute from "./Utilities/PrivateRoute.jsx";

import Home from "./pages/Home.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Navigationbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected: requires login */}
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderTracking />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="mx-auto max-w-lg px-4 py-24 text-center">
                <h1 className="font-display text-3xl font-bold text-ink">404</h1>
                <p className="mt-2 text-muted">This page wandered off the delivery route.</p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
