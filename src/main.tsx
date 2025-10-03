import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root")!);

(async () => {
  try {
    const base = import.meta.env.BASE_URL; 
    const url = `${base}config/config.json`;

    const cfgRes = await fetch(url, { cache: "no-store" });
    if (!cfgRes.ok) throw new Error(`config.json ${cfgRes.status}`);
    const cfg = await cfgRes.json();

    (window as any).CONFIG = cfg;

    try {
      const oidcRes = await fetch("/config/config-oidc.json", { cache: "no-store" });
      if (oidcRes.ok) {
        (window as any).OIDCCfg = await oidcRes.json();
      }
    } catch {  }

    root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  } catch (err: any) {
    root.render(
      <div style={{ padding: 16, color: "crimson", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        Cannot load config: {err?.message || String(err)}
      </div>
    );
  }
})();
