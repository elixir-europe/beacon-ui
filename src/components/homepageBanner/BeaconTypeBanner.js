import BeaconNetworkBanner from "./BeaconNetworkBanner";
import SingleBeaconBanner from "./SingleBeaconBanner";
import { Box } from "@mui/material";

export default function BeaconTypeBanner() {
  const beaconType = CONFIG.beaconType;

  const sharedStyles = {
    boxShadow: "0px 8px 11px 0px #9BA0AB24",
    minHeight: "218px",
    width: "100%",
    display: "flex",
    marginTop: { lg: "-60px", md: "-60px", sm: "0px", xs: "0px" },
    overflow: "hidden",
    mb: 3,
    borderRadius: "8px",
  };

  let content = null;

  if (beaconType === "networkBeacon") {
    content = <BeaconNetworkBanner />;
  } else if (beaconType === "singleBeacon") {
    content = <SingleBeaconBanner />;
  }

  if (!content) return null;

  return <Box sx={sharedStyles}>{content}</Box>;
}
