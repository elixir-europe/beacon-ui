import { Box, Typography } from "@mui/material";
import GenomicInputBox from "../GenomicInputBox";
import { mainBoxTypography } from "../styling/genomicInputBoxStyling";

export default function GenomicLocationBracket() {
  return (
    <Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 6,
          width: "100%",
        }}
      >
        <Box sx={{ width: "60%" }}>
          <Typography
            variant="h6"
            sx={{
              ...mainBoxTypography,
              mt: 0,
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Main Parameters
          </Typography>
          <Typography
            sx={{
              ...mainBoxTypography,
              mt: 0,
            }}
          >
            You need to fill in the fields with a (*)
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ flex: 1, minWidth: "120px" }}>
                <GenomicInputBox
                  name="assemblyId"
                  label="Assembly ID"
                  options={CONFIG.assemblyId}
                  placeholder={CONFIG.assemblyId[0]}
                  required={true}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "120px" }}>
                <GenomicInputBox
                  // In the range context chromosome is also reference name
                  name="chromosome"
                  label="Chromosome"
                  placeholder="ex. Chr 1 (NC_000001.11)"
                  required={true}
                />
              </Box>
            </Box>
            <GenomicInputBox
              name="start"
              label="Start Braket"
              placeholder="ex. 5000000"
              required={true}
              endAdornmentLabel="(Min)"
            />
            <GenomicInputBox
              name="end"
              label="End Braket"
              placeholder="ex. 7676592"
              required={true}
              endAdornmentLabel="(Min)"
            />
          </Box>
        </Box>

        <Box sx={{ width: "40%" }}>
          <Typography
            variant="h6"
            sx={{
              ...mainBoxTypography,
              mt: 0,
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Optional parameters
          </Typography>
          <Typography
            sx={{
              ...mainBoxTypography,
              mt: 0,
            }}
          >
            You can add the Variant Length
          </Typography>

          {/* Optional Input Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
              justifyContent: "space-between",
              borderRadius: "10px",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <GenomicInputBox
                name="variationType"
                label="Variation Type"
                description="Select the Variation Type"
                placeholder={CONFIG.variationType[0]}
                options={CONFIG.variationType}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
