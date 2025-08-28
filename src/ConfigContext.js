import React, { createContext, useContext } from "react";

export const ConfigContext = createContext(null);

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("Loading context...");
  return ctx;
}
