import { alpha } from "@mui/material/styles";

export const getSelectableScopeStyles = (isSelected) => {

  const primary = CONFIG?.ui?.colors?.primary ?? "#3176B1";
  const darkPrimary = CONFIG?.ui?.colors?.darkPrimary ?? "#173D5D";
  const hoverColor = alpha(primary, 0.05);

  return {
    borderRadius: "7px",
    fontWeight: 400,
    fontSize: "12px",
    px: 1.5,
    py: 0.3,
    mr: 1,
    mb: 0.5,
    fontFamily: '"Open Sans", sans-serif',
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    textTransform: "capitalize",
    backgroundColor: isSelected ? primary : "#fff",
    color: isSelected ? "#fff" : darkPrimary,
    border: `1px solid ${isSelected ? primary : darkPrimary}`,
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
      backgroundColor: isSelected ? "none" : hoverColor,
    },
  };
};
