import { useEffect, useRef } from "react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Renders Google's official "Sign in with Google" button using
 * Google Identity Services (loaded via the <script> tag in index.html).
 */
const GoogleSignInButton = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const redirectTo = routerLocation.state?.from?.pathname || "/";
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await loginWithGoogle(response.credential);
          navigate(redirectTo, { replace: true });
        } catch (err) {
          console.error("Google sign-in failed", err);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 344,
      text: "continue_with",
      shape: "pill",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <p className="rounded-lg bg-turmeric-light px-3 py-2 text-center text-xs text-ink/70">
        Google sign-in isn't configured yet — add VITE_GOOGLE_CLIENT_ID to Frontend/.env
      </p>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
};

export default GoogleSignInButton;
