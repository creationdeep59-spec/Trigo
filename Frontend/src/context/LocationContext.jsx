import { createContext, useContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("trigo_location");
    return saved ? JSON.parse(saved) : null;
  });
  const [locationError, setLocationError] = useState(null);
  const [detecting, setDetecting] = useState(false);

  const persist = (loc) => {
    setLocation(loc);
    localStorage.setItem("trigo_location", JSON.stringify(loc));
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported on this browser");
      return;
    }
    setDetecting(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let label = "Current location";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          label =
            data?.address?.suburb ||
            data?.address?.city ||
            data?.address?.town ||
            data?.display_name?.split(",")[0] ||
            label;
        } catch {
          // reverse geocoding is best-effort; fall back to coordinates label
        }
        persist({ label, lat: latitude, lng: longitude });
        setDetecting(false);
      },
      (err) => {
        setLocationError(err.message || "Couldn't detect location");
        setDetecting(false);
      }
    );
  };

  const setManualLocation = (label, lat = null, lng = null) => {
    persist({ label, lat, lng });
  };

  return (
    <LocationContext.Provider
      value={{ location, detectCurrentLocation, setManualLocation, locationError, detecting }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
