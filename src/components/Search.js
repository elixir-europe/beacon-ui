import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Button,
  CircularProgress,
  InputBase,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { darken, lighten } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import { useSelectedEntry } from "./context/SelectedEntryContext";
import GenomicQueryBuilderButton from "./genomic/GenomicQueryBuilderButton";
import GenomicQueryBuilderDialog from "./genomic/GenomicQueryBuilderDialog";
import AllFilteringTermsButton from "./filters/AllFilteringTermsButton";
import FilteringTermsDropdownResults from "./filters/FilteringTermsDropdownResults";
import QueryApplied from "./search/QueryApplied";
import SearchButton from "./search/SearchButton";
import FilterTermsExtra from "./search/FilterTemsExtra";

export default function Search({
  onHeightChange,
  selectedTool,
  setSelectedTool,
}) {
  const { entryTypes, setEntryTypes, setBeaconsInfo } = useSelectedEntry();
  const { entryTypesConfig, setEntryTypesConfig } = useSelectedEntry();
  const { selectedFilter, setSelectedFilter } = useSelectedEntry();
  const { extraFilter, hasSearchResults } = useSelectedEntry();
  const { selectedPathSegment, setSelectedPathSegment } = useSelectedEntry();
  const { isLoaded, setIsLoaded } = useSelectedEntry();
  
  const [loading, setLoading] = useState(true);
  const [activeInput, setActiveInput] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [assembly, setAssembly] = useState(CONFIG.assemblyId[0]);
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchRef.current && onHeightChange) {
      const observer = new ResizeObserver(() => {
        onHeightChange(searchRef.current.offsetHeight);
      });
      observer.observe(searchRef.current);

      return () => observer.disconnect();
    }
  }, [onHeightChange]);

  const configuredOrder = CONFIG.ui.entryTypesOrder;
  const sortEntries = (entries) =>
    configuredOrder?.length > 0 && entries.length > 1
      ? [...entries].sort(
          (a, b) =>
            configuredOrder.indexOf(a.pathSegment) -
            configuredOrder.indexOf(b.pathSegment)
        )
      : entries;

  function filterGenomicVariation([key]) {
    return !key.toLowerCase().includes("genomicvariation");
  }
  
  function mapEntry([key, value]) {
    const originalSegment = value.rootUrl?.split("/").pop();
    const normalizedSegment =
      originalSegment === "genomicVariations" ? "g_variants" : originalSegment;
  
    return {
      id: key,
      pathSegment: normalizedSegment,
      originalPathSegment: originalSegment,
      rootUrl: value.rootUrl,
    };
  }
  
  function isUniquePathSegment(entry, index, self) {
    return index === self.findIndex(e => e.pathSegment === entry.pathSegment);
  }
  
  useEffect(() => {
    const fetchEntryTypes = async () => {
      try {
        const res = await fetch(`${CONFIG.apiUrl}/map`);
        const data = await res.json();
        const endpointSets = data.response.endpointSets || {};

        setIsLoaded(false);

        const entries = Object.entries(endpointSets)
          .filter(filterGenomicVariation)
          .map(mapEntry)
          .filter(isUniquePathSegment);
  
        const sorted = sortEntries(entries);
        setEntryTypes(sorted);
  
        if (sorted.length > 0) {
          setSelectedPathSegment(sorted[0].pathSegment);
        }
        await handleBeaconsInfo();

        setIsLoaded(true);
      } catch (err) {
        console.error("Error fetching entry types:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEntryTypes();
  }, []);

  const fetchConfiguration = async () => {
    try {
      const res = await fetch(`${CONFIG.apiUrl}/configuration`);
      const data = await res.json();
      setEntryTypesConfig(data.response.entryTypes || {});
    } catch (err) {
      console.error("Error fetching configuration:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchConfiguration();
      //setLoading(false);
    };

    fetchAll();
  }, []);

  const handleBeaconsInfo = async () => {
    try {
      let url = `${CONFIG.apiUrl}/info`;
      let response = await fetch(url);
      const data = await response.json();
      let normalizedData = [];
      if (Array.isArray(data.responses)) {
        normalizedData = data.responses;
      } else if (data.response) {
        if (Array.isArray(data.response)) {
          normalizedData = data.response;
        } else if (
          typeof data.response === "object" &&
          data.response !== null
        ) {
          normalizedData = [data.response];
        }
      }
      setBeaconsInfo(normalizedData);
    } catch (error) {
      // TODO
      console.error("Search failed", error);
    }
  };

  useEffect(() => {
    setActiveInput(selectedPathSegment === "g_variants" ? "genomic" : "filter");
  }, [selectedPathSegment]);

  const isSingleEntryType = entryTypes.length === 1;
  const onlyEntryPath = entryTypes[0]?.pathSegment;
  const isSingleNonGenomic =
    isSingleEntryType && onlyEntryPath !== "g_variants";

  const singleEntryCustomLabels = {
    g_variants: "Genomic Variants",
    individuals: "Individual Level Data",
    biosamples: "Biosamples",
    runs: "Runs",
    analyses: "Analysis",
    cohorts: "Cohorts",
    datasets: "Datasets",
  };

  const hasGenomic = entryTypes.some((e) => e.pathSegment === "g_variants");

  const isGenomicFirstOrOnly =
    entryTypes.length === 1 ||
    entryTypes[0]?.pathSegment === "g_variants" ||
    selectedPathSegment === "g_variants";

  const formatEntryLabel = (segment) => {
    if (!segment) return "Unknown";
    return segment === "g_variants"
      ? "Genomic Variants"
      : segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const primaryColor = CONFIG.ui.colors.primary;
  const primaryDarkColor = CONFIG.ui.colors.darkPrimary;
  const selectedBgColor = lighten(primaryDarkColor, 0.9);

  const entryTypeDescriptions = {
    analyses: "query analysis metadata (e.g. analysis pipelines, methods)",
    biosamples: "query biosample data (e.g. histological samples)",
    cohorts: "query cohort-level data (e.g. shared traits, study groups)",
    datasets: "query datasets-level data (e.g. name, description)",
    g_variants: "query genomic variants across individuals",
    individuals: "query individual-level data (e.g. phenotypes, treatment)",
    runs: "query sequencing run details (e.g. platform, run date)",
  };

  const handleAllFilteringClick = () => {
    setSelectedTool((prev) =>
      prev === "allFilteringTerms" ? null : "allFilteringTerms"
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderInput = (type) => {
    if (type === "genomic") {
      return (
        <Box
          onClick={() => setActiveInput(type)}
          sx={{
            flex: activeInput === type ? 1 : 0.3,
            display: "flex",
            alignItems: "center",
            border: `1.5px solid ${primaryDarkColor}`,
            borderRadius: "999px",
            backgroundColor: "#fff",
            transition: "flex 0.3s ease",
          }}
        >
          {activeInput === "genomic" && (
            <Select
              value={assembly}
              onChange={(e) => setAssembly(e.target.value)}
              variant="standard"
              disableUnderline
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                backgroundColor: "black",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: '"Open Sans", sans-serif',
                pl: 3,
                pr: 2,
                py: 0,
                height: "47px",
                borderTopLeftRadius: "999px",
                borderBottomLeftRadius: "999px",
                ".MuiSelect-icon": {
                  color: "#fff",
                  mr: 1,
                },
              }}
            >
              {CONFIG.assemblyId.map((id) => (
                <MenuItem key={id} value={id} sx={{ fontSize: "12px" }}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          )}

          <Box sx={{ px: 1, color: primaryDarkColor }}>
            <SearchIcon />
          </Box>

          <InputBase
            placeholder="Search by Genomic Query"
            fullWidth
            sx={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "14px",
              pr: 2,
              height: "47px",
            }}
          />
        </Box>
      );
    }

    return (
      <Box
        onClick={() => setActiveInput(type)}
        sx={{
          flex: activeInput === type ? 1 : 0.3,
          display: "flex",
          flexDirection: "column", // Important: allow dropdown to appear below
          alignItems: "stretch",
          border: `1.5px solid ${primaryDarkColor}`,
          borderRadius: "999px",
          backgroundColor: "#fff",
          transition: "flex 0.3s ease",
          position: "relative", // anchors dropdown here
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SearchIcon sx={{ color: primaryDarkColor, mr: 1 }} />
          <InputBase
            placeholder="Search by Filtering Terms (min. 1 letter required)"
            fullWidth
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "14px",
            }}
          />
        </Box>

        <FilteringTermsDropdownResults
          searchInput={searchInput}
          onCloseDropdown={() => setSearchInput("")}
        />
      </Box>
    );
  };

  return (
    <>
      <Box
        ref={searchRef}
        sx={{
          mb: { lg: 6, md: 6, sm: 2, xs: 3 },
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 8px 11px 0px #9BA0AB24",
          p: "24px 32px",
        }}
      >
        <Typography
          sx={{
            mb: 2,
            fontWeight: 700,
            fontFamily: '"Open Sans", sans-serif',
            fontSize: entryTypes.length === 1 ? "16px" : "14px",
          }}
        >
          {isSingleEntryType
            ? `Search ${
                singleEntryCustomLabels[onlyEntryPath] ||
                formatEntryLabel(onlyEntryPath)
              }`
            : "Search"}
        </Typography>

        {!isSingleEntryType && (
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontFamily: '"Open Sans", sans-serif', fontSize: "14px" }}
            >
              1. Choose the <b>result type</b> for your search.
            </Typography>

            <Tooltip
              title={
                <Box
                  component="ul"
                  sx={{
                    pl: { xs: "5px", lg: "20px" },
                    fontFamily: '"Open Sans", sans-serif',
                  }}
                >
                  {entryTypes.map((entry) => (
                    <li key={entry.pathSegment}>
                      <b>{formatEntryLabel(entry.pathSegment)}</b>:{" "}
                      {entryTypeDescriptions[entry.pathSegment] ||
                        `No description for ${entry.pathSegment}`}
                    </li>
                  ))}
                </Box>
              }
              placement="top-start"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid black",
                    minWidth: {
                      xs: "361px",
                      sm: "400px",
                    },
                  },
                },
                arrow: {
                  sx: {
                    color: "#fff",
                    "&::before": { border: "1px solid black" },
                  },
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  cursor: "pointer",
                  ml: 3,
                  mb: "4px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "30px",
                  backgroundColor: primaryColor,
                  color: "white",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                i
              </Box>
            </Tooltip>
          </Box>
        )}

        {loading || !isLoaded ? (
          <CircularProgress />
        ) : !isSingleEntryType ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {entryTypes.map((entry) => (
              <Button
                key={entry.id}
                onClick={() => setSelectedPathSegment(entry.pathSegment)}
                variant="outlined"
                sx={{
                  borderRadius: "999px",
                  fontWeight: 700,
                  textTransform: "none",
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: "14px",
                  backgroundColor:
                    selectedPathSegment === entry.pathSegment
                      ? selectedBgColor
                      : "#FFFFFF",
                  color:
                    selectedPathSegment === entry.pathSegment
                      ? "black"
                      : primaryColor,
                  border: `1px solid ${
                    selectedPathSegment === entry.pathSegment
                      ? "black"
                      : primaryColor
                  }`,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor:
                      selectedPathSegment === entry.pathSegment
                        ? selectedBgColor
                        : darken("#FFFFFF", 0.05),
                  },
                }}
              >
                {formatEntryLabel(entry.pathSegment)}
              </Button>
            ))}
          </Box>
        ) : null}

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 4 }}>
          {isSingleNonGenomic ? (
            <Typography
              variant="body1"
              sx={{ fontFamily: '"Open Sans", sans-serif', fontSize: "14px" }}
            >
              Add the <b>Filtering Terms</b> you need for your search:
            </Typography>
          ) : (
            <Typography
              variant="body1"
              sx={{ fontFamily: '"Open Sans", sans-serif', fontSize: "14px" }}
            >
              {isSingleEntryType ? "" : "2. "}
              Use the search bar on the left to add{" "}
              <b>
                {isGenomicFirstOrOnly ? "Genomic query" : "Filtering terms"}
              </b>{" "}
              or the search bar on the right to add a{" "}
              <b>
                {isGenomicFirstOrOnly ? "Filtering terms" : "Genomic query"}:
              </b>
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {isSingleNonGenomic ? (
            renderInput("filter")
          ) : isGenomicFirstOrOnly ? (
            hasGenomic && (
              <>
                {renderInput("genomic")}
                {renderInput("filter")}
              </>
            )
          ) : hasGenomic ? (
            <>
              {renderInput("filter")}
              {renderInput("genomic")}
            </>
          ) : (
            renderInput("filter")
          )}
        </Box>
        {extraFilter && <FilterTermsExtra />}
        {selectedFilter.length > 0 && <QueryApplied />}

        <Box
          sx={{
            mt: 5,
            gap: 2,
            flexWrap: "wrap",
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
              md: "row",
            },
            justifyContent: {
              xs: "center",
              sm: "space-between",
              md: "space-between",
            },
            alignItems: "center",
            textAlign: "center",
            "@media (max-width: 1008px) and (min-width: 900px)": {
              flexDirection: "column",
            },
            "@media (max-width: 653px)": {
              flexDirection: "column",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 4,
              "@media (max-width: 1008px) and (min-width: 900px)": {
                width: "100%",
                justifyContent: "center",

                gap: 8,
              },
              "@media (max-width: 653px)": {
                width: "100%",
                justifyContent: "center",
                gap: 8,
              },
            }}
          >
            {hasGenomic && (
              <>
                <GenomicQueryBuilderButton
                  onClick={() => {
                    setSelectedTool((prev) =>
                      prev === "genomicQueryBuilder"
                        ? null
                        : "genomicQueryBuilder"
                    );
                    handleClickOpen();
                  }}
                  selected={selectedTool === "genomicQueryBuilder"}
                />
                <GenomicQueryBuilderDialog
                  open={open}
                  handleClose={handleClose}
                />
              </>
            )}
            <AllFilteringTermsButton
              onClick={handleAllFilteringClick}
              selected={selectedTool === "allFilteringTerms"}
            />
          </Box>

          <Box>
            <SearchButton
              setSelectedTool={setSelectedTool}
              entryTypesConfig={entryTypesConfig}
              selectedPathSegment={selectedPathSegment}
              selectedFilter={selectedFilter}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}
