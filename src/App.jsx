import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import { SelectedEntryProvider } from "./components/context/SelectedEntryContext";
import useNavItems from "./nav/useNavItems";

export default function App() {
  const [selectedTool, setSelectedTool] = useState(null);

  const CFG = window.CONFIG ?? {};
  const UI = CFG.ui ?? {};
  const LOGOS = UI.logos ?? {};

  const navItems = useNavItems(CFG);

  return (
    <SelectedEntryProvider>
      <Router>
        <Box
          sx={{
            backgroundColor: "#F5F5F5",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CssBaseline />

          <Navbar title={UI.title || "App"} main={LOGOS.main} navItems={navItems} />

          <Box component="main" sx={{ pt: 10, px: { xs: 2, md: 4 }, flexGrow: 1 }}>
            <AppRoutes
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
            />
          </Box>

          <Footer navItems={navItems} />
        </Box>
      </Router>
    </SelectedEntryProvider>
  );
}