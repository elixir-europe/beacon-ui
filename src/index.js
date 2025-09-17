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

    console.log(process.env)

    const oidcConfig = {
      authority: `${process.env.REACT_APP_BEACON_UI_OIDC_ENDPOINT}`,
      client_id: `${process.env.REACT_APP_BEACON_UI_OIDC_CLIENT_ID}`,
      redirect_uri: `https://beacons.bsc.es/`,
      post_logout_redirect_uri: `https://beacons.bsc.es/`,
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

    console.log(oidcConfig);

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