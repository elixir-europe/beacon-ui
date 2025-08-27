import { Typography, Box, Radio } from "@mui/material";

const getColors = () => ({
  primary: CONFIG?.ui?.colors?.primary ?? "#3176B1",
  dark: CONFIG?.ui?.colors?.darkPrimary ?? "#173D5D",
});

export const selectStyle = () => {
  const { dark } = getColors();
  return {
    backgroundColor: "#F5FAFE",
    borderRadius: "10px",
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiSelect-select": {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "14px",
      color: dark,
      padding: "12px 16px",
    },
  };
};

export const mainBoxTypography = () => {
  const { dark } = getColors();
  return {
    mt: 3,
    mb: 2,
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: 400,
    fontSize: "12px",
    color: dark,
  };
};

export const textFieldStyle = () => {
  const { dark } = getColors();
  return {
    backgroundColor: "#F5FAFE",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { border: "none" },
    },
    "& input": {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: "14px",
      color: dark,
      padding: "12px 16px",
    },
  };
};

export const FieldLabel = ({ children }) => {
  const { dark } = getColors();
  return (
    <Typography
      sx={{
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: 400,
        fontSize: "12px",
        color: dark,
        mb: 1,
        mt: "-4px",
        whiteSpace: { xs: "normal", sm: "nowrap" },
      }}
    >
      {children}
    </Typography>
  );
};

export const FieldHeader = ({
  label,
  required,
  isSelectable,
  isSelected,
  onSelect,
}) => {
  const { dark, primary } = getColors();
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {isSelectable && (
        <Radio
          checked={isSelected}
          onClick={onSelect}
          value={label}
          sx={{
            padding: "0 8px 0 0",
            color: dark,
            "&.Mui-checked": { color: dark },
          }}
        />
      )}
      <Typography
        sx={{
          fontFamily: '"Open Sans", sans-serif',
          fontWeight: 700,
          fontSize: "14px",
          color: dark,
        }}
      >
        {label}
        {required && <span style={{ color: dark }}>*</span>}
      </Typography>
    </Box>
  );
};
