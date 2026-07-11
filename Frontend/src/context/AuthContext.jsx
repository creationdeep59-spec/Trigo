import { createContext, useContext, useEffect, useState } from "react";
import api from "../Utilities/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("trigo_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("trigo_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const { data } = await api.post("/users/login", { identifier, password });
    localStorage.setItem("trigo_token", data.token);
    setUser(data);
    return data;
  };

  const register = async (name, identifier, password) => {
    const { data } = await api.post("/users/register", { name, identifier, password });
    localStorage.setItem("trigo_token", data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("trigo_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
