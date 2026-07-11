import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, ShoppingBag, User, ChevronDown, LocateFixed, X, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLocation } from "../context/LocationContext.jsx";

const Navigationbar = () => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const { location, detectCurrentLocation, setManualLocation, locationError, detecting } =
    useLocation();
  const navigate = useNavigate();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const debounceRef = useRef(null);

  // Live address suggestions as the user types (debounced, via OpenStreetMap Nominatim)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (manualInput.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchingAddress(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
            manualInput
          )}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearchingAddress(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [manualInput]);

  const handleSelectSuggestion = (place) => {
    const label =
      place.address?.suburb ||
      place.address?.neighbourhood ||
      place.address?.city ||
      place.address?.town ||
      place.display_name.split(",")[0];
    setManualLocation(`${label}, ${place.address?.city || place.address?.town || ""}`.replace(/, $/, ""), parseFloat(place.lat), parseFloat(place.lon));
    setShowLocationModal(false);
    setManualInput("");
    setSuggestions([]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setManualLocation(manualInput.trim());
    setShowLocationModal(false);
    setManualInput("");
    setSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-base/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              Trigo<span className="text-chili">.</span>
            </span>
          </Link>

          <button
            onClick={() => setShowLocationModal(true)}
            className="hidden shrink-0 items-center gap-1 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-chili/40 md:flex"
          >
            <MapPin size={16} className="text-chili" />
            <span className="max-w-[160px] truncate">
              {location?.label || "Set your location"}
            </span>
            <ChevronDown size={14} className="text-muted" />
          </button>

          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2"
          >
            <Search size={17} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants, cuisines, or dishes"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </form>

          <Link
            to="/cart"
            className="relative flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-ink transition hover:bg-card"
          >
            <ShoppingBag size={20} />
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-chili text-[11px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative shrink-0">
              <button className="flex items-center gap-2 rounded-full bg-card px-3 py-2 text-sm font-semibold text-ink">
                <User size={16} />
                <span className="hidden sm:inline">{user.name?.split(" ")[0]}</span>
              </button>
              <div className="invisible absolute right-0 mt-2 w-44 rounded-xl2 border border-ink/10 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <Link to="/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-card">
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-chili hover:bg-chili-light"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-chili"
            >
              Log in
            </Link>
          )}
        </div>
      </header>

      {/* mobile location bar */}
      <button
        onClick={() => setShowLocationModal(true)}
        className="flex w-full items-center gap-1 border-b border-ink/5 bg-card px-4 py-2 text-sm font-medium text-ink md:hidden"
      >
        <MapPin size={15} className="text-chili" />
        <span className="truncate">{location?.label || "Set your location"}</span>
        <ChevronDown size={14} className="text-muted" />
      </button>

      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-24">
          <div className="w-full max-w-md rounded-xl2 bg-white p-6 shadow-2xl animate-riseIn">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">Deliver to</h3>
              <button onClick={() => setShowLocationModal(false)}>
                <X size={20} className="text-muted" />
              </button>
            </div>

            <button
              onClick={() => {
                detectCurrentLocation();
              }}
              disabled={detecting}
              className="mb-3 flex w-full items-center gap-2 rounded-xl border border-chili/30 bg-chili-light px-4 py-3 text-sm font-semibold text-chili-dark transition hover:bg-chili/10 disabled:opacity-60"
            >
              <LocateFixed size={18} />
              {detecting ? "Detecting your location…" : "Use current location"}
            </button>

            {locationError && (
              <p className="mb-3 text-xs text-chili-dark">{locationError}</p>
            )}

            <div className="mb-3 flex items-center gap-2 text-xs text-muted">
              <div className="h-px flex-1 bg-ink/10" />
              OR ENTER MANUALLY
              <div className="h-px flex-1 bg-ink/10" />
            </div>

            <form onSubmit={handleManualSubmit} className="relative">
              <div className="flex gap-2">
                <input
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Enter area, street name..."
                  autoComplete="off"
                  className="flex-1 rounded-lg border border-ink/10 px-3 py-2 text-sm outline-none focus:border-chili"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-chili"
                >
                  Save
                </button>
              </div>

              {searchingAddress && (
                <div className="mt-2 flex items-center gap-2 px-1 text-xs text-muted">
                  <Loader2 size={13} className="animate-spin" />
                  Searching...
                </div>
              )}

              {suggestions.length > 0 && (
                <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-ink/10 bg-white shadow-sm">
                  {suggestions.map((place) => (
                    <li key={place.place_id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(place)}
                        className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-card"
                      >
                        <MapPin size={14} className="mt-0.5 shrink-0 text-chili" />
                        <span className="line-clamp-2 text-ink">{place.display_name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigationbar;