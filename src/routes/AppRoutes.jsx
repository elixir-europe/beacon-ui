import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NetworkMembers from "../pages/NetworkMembers";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";

export default function AppRoutes({ selectedTool, setSelectedTool }) {
  const CFG = window.CONFIG ?? {};
  const UI = CFG.ui ?? {};

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
          />
        }
      />

      {CFG.beaconType === "networkBeacon" && (
        <Route path="/network-members" element={<NetworkMembers />} />
      )}

      {UI.showAboutPage && <Route path="/about" element={<About />} />}
      {UI.showContactPage && <Route path="/contact" element={<Contact />} />}

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
