import { Box, Typography, CircularProgress, Fade } from "@mui/material";
//import config from "../../config/config.json";

export default function Loader({ message, variant = "default" }) {
  const loaderColor = CONFIG.ui.colors.primary;

  const isInline = variant === "inline";

  
  return (
    <Fade in timeout={500}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={isInline ? 150 : 300}
        width="100%"
        textAlign="center"
        sx={{
          backgroundColor: "transparent",
          borderRadius: 2,
          p: 2,
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: loaderColor,
            mb: 2,
            animation: "spin 2s linear infinite"
          }}
        />
        <Typography
          translate="no"
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#555",
            fontStyle: "italic",
            maxWidth: "80%",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Fade>
  );
}
