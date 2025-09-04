import { Box, TextField, Select, MenuItem, Typography } from "@mui/material";
import { useField } from "formik";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  selectStyle,
  textFieldStyle,
  FieldLabel,
  FieldHeader,
} from "./styling/genomicInputBoxStyling";
import AminoAcidChangeFields from "./sharedFields/AminoAcidChangeFields";
import BasesChangeFields from "./sharedFields/BasesChangeFields";

export default function GenomicInputBox({
  name,
  label,
  placeholder,
  description,
  required = false,
  options = [],
  isSelectable = false,
  isSelected = false,
  onSelect = () => {},
  endAdornmentLabel = "",
  customRefLabel,
  customAltLabel,
  customRefPlaceholder,
  customAltPlaceholder,
  customPaddingTop,
}) {
  const [field, meta, helpers] = useField(name);
  const error = meta.touched && meta.error;
  const primaryDarkColor = CONFIG.ui.colors.darkPrimary;
  const isDisabled = isSelectable && !isSelected;

  const renderFieldByType = () => {
    if (name === "basesChange") {
      return (
        <BasesChangeFields
          isDisabled={isDisabled}
          customRefLabel={customRefLabel}
          customAltLabel={customAltLabel}
          customRefPlaceholder={customRefPlaceholder}
          customAltPlaceholder={customAltPlaceholder}
          customPaddingTop={customPaddingTop}
        />
      );
    }
    if (name === "aminoacidChange")
      return <AminoAcidChangeFields isDisabled={isDisabled} />;
    if (options.length > 0) {
      return (
        <Select
          fullWidth
          IconComponent={KeyboardArrowDownIcon}
          displayEmpty
          {...field}
          onChange={(e) => helpers.setValue(e.target.value)}
          error={!!error}
          disabled={isDisabled}
          sx={{
            ...selectStyle,
            "& .MuiSelect-select": {
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "14px",
              color: field.value ? CONFIG.ui.colors.darkPrimary : "#999",
              padding: "12px 16px",
            },
          }}
          renderValue={(selected) =>
            selected ? (
              selected
            ) : (
              <span
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "14px",
                  color: "#999",
                }}
              >
                {placeholder}
              </span>
            )
          }
        >
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option} sx={{ fontSize: "12px" }}>
              {option}
            </MenuItem>
          ))}
        </Select>
      );
    }
    return (
      <TextField
        fullWidth
        placeholder={placeholder}
        {...field}
        error={!!error}
        helperText={error}
        disabled={isDisabled}
        sx={textFieldStyle}
        InputProps={{
          endAdornment: endAdornmentLabel ? (
            <Typography
              sx={{
                fontSize: "12px",
                color: primaryDarkColor,
                fontFamily: '"Open Sans", sans-serif',
                mr: 1,
              }}
            >
              {endAdornmentLabel}
            </Typography>
          ) : null,
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        border: `1px solid ${primaryDarkColor}`,
        borderRadius: "10px",
        padding: "12px",
        backgroundColor: isDisabled ? "#F0F0F0" : "white",
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      <FieldHeader
        label={label}
        required={required}
        isSelectable={isSelectable}
        isSelected={isSelected}
        onSelect={onSelect}
      />
      {description && <FieldLabel>{description}</FieldLabel>}
      {renderFieldByType()}
    </Box>
  );
}
