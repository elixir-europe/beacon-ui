import { useState } from "react";
import { Box, Typography } from "@mui/material";
import GenomicInputBox from "../GenomicInputBox";
import { mainBoxTypography } from "../styling/genomicInputBoxStyling";

export default function GenomicLocationRage() {
  const [selectedInput, setSelectedInput] = useState("variationType");

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
        <Box sx={{ width: "30%" }}>
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
            <GenomicInputBox
              name="assemblyId"
              label="Assembly ID"
              placeholder={CONFIG.assemblyId[0]}
              options={CONFIG.assemblyId}
              required={true}
            />
            <GenomicInputBox
              // In the range context chromosome is also reference name
              name="chromosome"
              label="Chromosome"
              placeholder="ex. Chr 1 (NC_000001.11)"
              required={true}
            />
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
                  name="start"
                  label="Start"
                  required={true}
                  placeholder="ex. 7572837"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "120px" }}>
                <GenomicInputBox
                  name="end"
                  label="End"
                  required={true}
                  placeholder="ex. 7578641"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: "70%" }}>
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
            Please select one:
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
                isSelectable
                isSelected={selectedInput === "variationType"}
                onSelect={() => setSelectedInput("variationType")}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <GenomicInputBox
                name="basesChange"
                label="Bases Change"
                placeholder="ex. BRAF"
                isSelectable
                isSelected={selectedInput === "basesChange"}
                onSelect={() => setSelectedInput("basesChange")}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <GenomicInputBox
                name="aminoacidChange"
                label="Aminoacid Change"
                placeholder="ex. BRAF"
                isSelectable
                isSelected={selectedInput === "aminoacidChange"}
                onSelect={() => setSelectedInput("aminoacidChange")}
              />
            </Box>
          </Box>

          <Typography sx={mainBoxTypography}>
            You can add the Variant Length
          </Typography>

          {/* Genomic Location Row */}
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
                name="minVariantLength"
                label="Min Variant Length"
                description="Select the Min Variant Length in bases"
                placeholder="ex. 5"
                endAdornmentLabel="Bases"
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <GenomicInputBox
                name="maxVariantLength"
                label="Max Variant Length"
                description="Select the Max Variant Length in bases"
                placeholder="ex. 125"
                endAdornmentLabel="Bases"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
