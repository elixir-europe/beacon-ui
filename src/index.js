import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { loadConfig } from "./configLoader";

(async () => {
  try {
    const cfg = await loadConfig();
    
    window.CONFIG  = cfg;
    globalThis.CONFIG = cfg; 
    createRoot(document.getElementById("root")).render(<App />);
  } catch (err) {
    console.error("Failed to load config:", err);
    createRoot(document.getElementById("root")).render(
      <div style={{ padding: 16, color: "crimson" }}>
        ⚠️Cannot load config: {err && err.message ? err.message : String(err)}
      </div>
    );
  }
})();