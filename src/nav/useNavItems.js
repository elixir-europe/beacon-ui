import { useMemo } from "react";

export default function useNavItems(CFG) {
  const UI = CFG.ui ?? {};

  return useMemo(() => {
    const base = [
      { label: "Network Members", url: "/network-members" },
      ...(UI.showAboutPage ? [{ label: "About", url: "/about" }] : []),
      ...(UI.showContactPage ? [{ label: "Contact", url: "/contact" }] : []),
      { label: "Log in", url: "/login" },
    ];

    const filteredBase =
      CFG.beaconType !== "networkBeacon"
        ? base.filter((i) => i.label !== "Network Members")
        : base;

    const external =
      UI.showExternalNavBarLink && Array.isArray(UI.externalNavBarLink)
        ? UI.externalNavBarLink.filter((l) => l?.label?.trim())
        : [];

    return [...external, ...filteredBase];
  }, [
    CFG.beaconType,
    UI.showAboutPage,
    UI.showContactPage,
    UI.showExternalNavBarLink,
    UI.externalNavBarLink,
  ]);
}
