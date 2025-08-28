import { Box, Typography } from "@mui/material";
//import config from "../../../config/config.json";
import GenomicInputBox from "../GenomicInputBox";
import { mainBoxTypography } from "../styling/genomicInputBoxStyling";

export default function DefinedVariationSequence() {
  return (
    <Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
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
            mb: 0,
          }}
        >
          You need to fill in the fields with a (*)
        </Typography>

        {/* Grid layout for fields */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
            width: "100%",
          }}
        >
          <GenomicInputBox
            name="assemblyId"
            label="Assembly ID"
            placeholder={CONFIG.assemblyId[0]}
            description={"Select your reference genome (Optional)"}
            options={CONFIG.assemblyId}
            required={false}
          />
          <GenomicInputBox
            name="chromosome"
            label="Chromosome"
            placeholder="ex. Chr 1 (NC_000001.11)"
            description={"Select the reference value:"}
            required={true}
          />
          <GenomicInputBox
            name="start"
            label="Start"
            description="Single Value"
            placeholder="ex. 7572837"
            required={true}
          />
          <GenomicInputBox
            name="basesChange"
            label="Bases Change"
            required={true}
            customRefLabel="Reference Bases"
            customAltLabel="Alternate Bases"
            customRefPlaceholder="ex. T"
            customAltPlaceholder="ex. G"
            customPaddingTop="4%"
          />
        </Box>
      </Box>
    </Box>
  );
}
