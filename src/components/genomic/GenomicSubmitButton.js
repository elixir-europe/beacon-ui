import { useFormikContext } from "formik";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function GenomicSubmitButton() {
  const { isValid, dirty } = useFormikContext();

  return (
    <Button
      type="submit"
      variant="outlined"
      disabled={!isValid || !dirty}
      startIcon={<AddIcon />}
      sx={{
        mt: 4,
        borderRadius: "999px",
        textTransform: "none",
        fontFamily: '"Open Sans", sans-serif',
        fontSize: "14px",
        fontWeight: 700,
        color: !isValid || !dirty ? "#9E9E9E" : CONFIG.ui.colors.darkPrimary,
        borderColor:
          !isValid || !dirty ? "#BDBDBD" : CONFIG.ui.colors.darkPrimary,
        "&:hover": {
          backgroundColor: !isValid || !dirty ? "transparent" : "#f2f2f2",
        },
      }}
    >
      Add Genomic Query
    </Button>
  );
}
