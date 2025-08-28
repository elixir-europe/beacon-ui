import { Button } from "@mui/material";
//import config from "../../../config/config.json";

export default function StyledGenomicLabels({ label, selected, onClick }) {
  const primaryDarkColor = CONFIG.ui.colors.darkPrimary;
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        borderRadius: "999px",
        fontWeight: 700,
        textTransform: "none",
        fontFamily: '"Open Sans", sans-serif',
        fontSize: "14px",
        backgroundColor: selected ? primaryDarkColor : "#FFFFFF",
        color: selected ? "white" : primaryDarkColor,
        border: `1px solid ${selected ? primaryDarkColor : primaryDarkColor}`,
        boxShadow: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          backgroundColor: selected ? primaryDarkColor : "#f5f5f5",
        },
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      {label}
    </Button>
  );
}
