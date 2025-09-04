import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { loadConfig } from "./configLoader";
import { AuthProvider } from "react-oidc-context";

(async () => {
  const root = createRoot(document.getElementById('root'));
  try {
    const cfg = await loadConfig();
    
    window.CONFIG  = cfg;
    globalThis.CONFIG = cfg; 

    const isProd = window.location.hostname === "beacons.bsc.es";
    const REDIRECT_URI = isProd
      ? `${cfg.appUrl}login`
      : "http://localhost:3000/login";

    const oidcConfig = {
      authority: cfg.oidcUrl,
      client_id: cfg.oidcClientId,
      redirect_uri: REDIRECT_URI,
      post_logout_redirect_uri: isProd ? `${cfg.appUrl}` : "http://localhost:3000/",
      response_type: "code",
      scope: "openid profile email offline_access",
      automaticSilentRenew: false,
      loadUserInfo: true,
      onSigninCallback: () => {
        const to = sessionStorage.getItem("returnTo") || "/";
        sessionStorage.removeItem("returnTo");
        window.history.replaceState({}, document.title, to);
      },
    };

    root.render(
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    );
    
  } catch (err) {
    console.error("Failed to load config:", err);
    createRoot(document.getElementById("root")).render(
      <div style={{ padding: 16, color: "crimson" }}>
        Cannot load config: {err && err.message ? err.message : String(err)}
      </div>
    );
  }
})();