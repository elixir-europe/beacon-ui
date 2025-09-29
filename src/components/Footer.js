import { Box, Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import maingrey from "../assets/logos/maingrey.svg";
import crg from "../assets/logos/crg.svg";
import bsc from "../assets/logos/bsc.png";

export default function Footer({ navItems }) {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#eee",
        py: 2,
        px: 4,
        minHeight: "68px",
        mt: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          "@media (max-width: 1044px) and (min-width: 900px)": {
            flexDirection: "column",
          },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mr: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, md: 3 },
            "@media (max-width: 1044px) and (min-width: 721px)": {
              gap: 6,
            },
            "@media (max-width: 648px) and (min-width:633px)": {
              gap: 4,
            },
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            color="black"
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
              },
              "@media (max-width: 648px) and (min-width:600px)": {
                fontSize: "12px",
              },
            }}
          >
            Beacon User Interface template provided by:
          </Typography>
          <MuiLink
            href="https://ega-archive.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={maingrey} alt="EGA Logo" style={{ height: 34 }} />
          </MuiLink>
          <MuiLink
            href="https://www.bsc.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={bsc} alt="BSC Logo" style={{ height: 34 }} />
          </MuiLink>
          <MuiLink
            href="https://www.crg.eu/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={crg} alt="CRG Logo" style={{ height: 34 }} />
          </MuiLink>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {navItems
            .filter((item) => item.label && item.label.trim() !== "")
            .map((item) =>
              item.url && item.url.startsWith("http") ? (
                <MuiLink
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "14px",
                    "@media (max-width: 452px)": {
                      fontSize: "12px",
                    },
                    color: "#333",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {item.label}
                </MuiLink>
              ) : (
                <MuiLink
                  key={item.label}
                  component={RouterLink}
                  to={item.url}
                  underline="none"
                  sx={{
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: "14px",
                    "@media (max-width: 452px)": {
                      fontSize: "12px",
                    },
                    color: "#333",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {item.label}
                </MuiLink>
              )
            )}
        </Box>
      </Box>
    </Box>
  );
}
