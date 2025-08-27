import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../components/pages/HomePage";
import NetworkMembers from "../components/pages/NetworkMembers";
import About from "../components/pages/About";
import Contact from "../components/pages/Contact";
import Login from "../components/pages/Login";

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
