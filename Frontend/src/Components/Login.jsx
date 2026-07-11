import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import GoogleSignInButton from "./GoogleSignInButton.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const redirectTo = routerLocation.state?.from?.pathname || "/";

  const [mode, setMode] = useState("email"); // "email" | "phone"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-xl2 border border-ink/5 bg-white p-8 shadow-xl">
        <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to order the food you're craving.</p>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>

        <div className="my-5 flex items-center gap-2 text-xs text-muted">
          <div className="h-px flex-1 bg-ink/10" />
          OR CONTINUE WITH EMAIL/PHONE
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <div className="flex rounded-full bg-card p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("email");
              setIdentifier("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 transition ${
              mode === "email" ? "bg-white shadow text-ink" : "text-muted"
            }`}
          >
            <Mail size={15} /> Email
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("phone");
              setIdentifier("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 transition ${
              mode === "phone" ? "bg-white shadow text-ink" : "text-muted"
            }`}
          >
            <Phone size={15} /> Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              {mode === "email" ? "Email address" : "Phone number"}
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 py-2.5 focus-within:border-chili">
              {mode === "email" ? (
                <Mail size={17} className="text-muted" />
              ) : (
                <Phone size={17} className="text-muted" />
              )}
              <input
                required
                type={mode === "email" ? "email" : "tel"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === "email" ? "you@example.com" : "10-digit mobile number"}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 py-2.5 focus-within:border-chili">
              <Lock size={17} className="text-muted" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? (
                  <EyeOff size={17} className="text-muted" />
                ) : (
                  <Eye size={17} className="text-muted" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-chili-light px-3 py-2 text-sm text-chili-dark">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-chili py-3 text-sm font-bold text-white transition hover:bg-chili-dark disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New to Trigo?{" "}
          <Link to="/register" className="font-semibold text-chili hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
