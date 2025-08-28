import { Box } from "@mui/material";
//import config from "../config/config.json";

export default function Founders() {
  const founderLogos = CONFIG?.ui?.logos?.founders || [];

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
        px: 5,
        maxWidth: "992px",
      }}
    >
      <Box sx={{ display: "flex", gap: 3 }}>
        {founderLogos.map((logo, index) => (
          <Box
            key={`logo-${index}`}
            component="img"
            src={logo}
            alt={`Founder ${index + 1}`}
            sx={{
              minHeight: "68x",
              width: "auto",
              objectFit: "contain",
            }}
            onError={(e) => {
              console.error(`Failed to load logo: ${logo}`);
              e.target.style.opacity = 0.5;
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
