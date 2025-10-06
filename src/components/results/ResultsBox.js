import { Box, Typography } from "@mui/material";
import ResultsFilters from "./ResultsFilters";
import ResultsTable from "./ResultsTable";
import ResultsQuery from "./ResultsQuery";

export default function ResultsBox() {
  return (
    <Box
      sx={{
        p: "32px",
      }}
    >
      <Box
        sx={{
          pb: "5px",
          display: "flex"
        }}
      >
        <Typography
          sx={{
            color: "black",
            fontSize: "17px",
            fontFamily: '"Open Sans", sans-serif',
            minWidth: "80px",
            fontWeight: "bold",
          }}
        >
          Results
          
        </Typography>
        <Box
            sx={{
              paddingLeft: "20px",
            }}>
          <ResultsQuery />
        </Box>
      </Box>
      <Box>
        <ResultsFilters />
        <ResultsTable />
      </Box>
    </Box>
  );
}
