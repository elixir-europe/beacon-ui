import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import "./App.css";

import TopNavbar from "./components/TopNavbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import ComponentsPage from "./components/ComponentsPage";
import ComponentNavbarDocs from "./components/ComponentNavbarDocs";
import ComponentSearchBoxDocs from "./components/ComponentSearchBox";
import ComponentResultTable from "./components/ComponentResultTable";
import ComponentCommonFilters from "./components/ComponentCommonFilters";
import ComponentGenomicAnnotations from "./components/ComponentGenomicAnnotations";
import ComponentBeaconNetworkBanner from "./components/ComponentBeaconNetworkBanner";
import ComponentConfiguration from "./components/ComponentConfiguration";
import ComponentAuthorization from "./components/ComponentAuthorization";
import ComponentBranding from "./components/ComponentBranding";

export default function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("beacon-docs-mode") as "light" | "dark") ||
      (prefersDark ? "dark" : "light")
  );

  useEffect(() => {
    localStorage.setItem("beacon-docs-mode", mode);
  }, [mode]);

  // Match your AppBar/Toolbar height. 64–68px is typical desktop.
  const HEADER_HEIGHT = 88;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#bebf32" : "#023452" },
          secondary: { main: "#06B6D4" },
          background: {
            default: mode === "dark" ? "#0B1220" : "#FCFCFD",
            paper: mode === "dark" ? "#101826" : "#FFFFFF",
          },
        },
        shape: { borderRadius: 16 },
        typography: {
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, Apple Color Emoji, Segoe UI Emoji",
          h3: { fontWeight: 800 },
          h4: { fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 600 },
        },
      }),
    [mode]
  );

  const CFG: any = (globalThis as any).CONFIG ?? {};
  const UI = CFG.ui ?? {};
  const title = UI.title || "ELIXIR Beacon UI Docs";
  const logoUrl = UI.logos?.main;
  const githubUrl = "https://github.com/elixir-europe/beacon-ui";

  const navItems = [
    { label: "Configuration", to: "/configuration" },
    { label: "Components", to: "/components" },
    { label: "Authorization", to: "/authorization" },
    { label: "Branding", to: "/branding" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <TopNavbar
        title={title}
        logoUrl={logoUrl}
        navItems={navItems}
        mode={mode}
        onToggleMode={() => setMode(mode === "dark" ? "light" : "dark")}
        githubUrl={githubUrl}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingTop: HEADER_HEIGHT,
        }}
      >
        <main className="main-content">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/components/navbar" element={<ComponentNavbarDocs />} />
              <Route path="/components/search-box" element={<ComponentSearchBoxDocs />} />
              <Route path="/components/results-table" element={<ComponentResultTable />} />
              <Route path="/components/common-filters" element={<ComponentCommonFilters />} />
              <Route path="/components/genomic-annotations" element={<ComponentGenomicAnnotations />} />
              <Route path="/components/network-members" element={<ComponentBeaconNetworkBanner />} />

              <Route path="/configuration" element={<ComponentConfiguration />} />
              <Route path="/authorization" element={<ComponentAuthorization />} />
              <Route path="/branding" element={<ComponentBranding />} />

              <Route path="*" element={<div>Not found</div>} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
