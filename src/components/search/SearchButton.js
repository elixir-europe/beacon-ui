import { Button } from "@mui/material";
import config from "../../config/config.json";
import SearchIcon from "@mui/icons-material/Search";
import { useSelectedEntry } from "../context/SelectedEntryContext";
import { COMMON_MESSAGES } from "../common/CommonMessage";
import { PATH_SEGMENT_TO_ENTRY_ID } from "../../components/common/textFormatting";
import LoupeIcon from '@mui/icons-material/Loupe';

export default function SearchButton({ setSelectedTool }) {
  const {
    selectedPathSegment,
    setLoadingData,
    setResultData,
    setHasSearchResult,
    selectedFilter,
    entryTypesConfig,
    setMessage,
    setHasSearchBeenTriggered,
    isLoaded,
    setIsLoaded
  } = useSelectedEntry();

  const handleSearch = async () => {
    const entryTypeId = PATH_SEGMENT_TO_ENTRY_ID[selectedPathSegment];
    const configForEntry = entryTypesConfig?.[entryTypeId];
    const nonFilteredAllowed =
      configForEntry?.nonFilteredQueriesAllowed ?? true;

    console.log("handling ....")

    if (!nonFilteredAllowed && selectedFilter.length === 0) {
      console.log("🚫 Search blocked - filters are required");
      setMessage(COMMON_MESSAGES.addFilter);
      setResultData([]);
      setHasSearchResult(true);
      return;
    }
    setMessage(null);
    setSelectedTool(null);
    setLoadingData(true);
    setResultData([]);
    setHasSearchBeenTriggered(true);
    setIsLoaded(false);

    try {
      const url = `${config.apiUrl}/${selectedPathSegment}`;
      let response;

      const query = queryBuilder(selectedFilter);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      };

      console.log("2: " , requestOptions)

      response = await fetch(url, requestOptions);
      

      if (!response.ok) {
        console.error("Fetch failed:", response.status);
        setResultData([]);
        setHasSearchResult(true);
        setIsLoaded(true);
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      // group beacons
      const rawItems = data?.response?.resultSets ?? data?.response?.collections ?? [];

      const groupedArray = Object.values(
        Object.values(rawItems).reduce((acc, item) => {
          const isBeaconNetwork = !!item.beaconId;
          const key = isBeaconNetwork ? item.beaconId : item.id;

          if (!acc[key]) {
            acc[key] = {
              ...(isBeaconNetwork
                ? { beaconId: item.beaconId, id: item.id }
                : { id: item.id }),
              exists: item.exists,
              info: item.info || null,
              totalResultsCount: 0,
              setType: item.setType,
              items: [],
              description: item.description ?? "",
            };
          }

          const count = Number(item.resultsCount) || 0;
          acc[key].totalResultsCount += count;

          if (Array.isArray(item.results)) {
            acc[key].items.push({
              dataset: item.id,
              results: item.results,
            });
          }

          return acc;
        }, {})
      );
      setResultData(groupedArray);
      setHasSearchResult(true);
    } catch (error) {
      setResultData([]);
      setHasSearchResult(true);
    } finally {
      setHasSearchResult(true);
      setLoadingData(false);
      setIsLoaded(true);
    }
  };

  const queryBuilder = (params) => {
    let filter = {
      meta: {
        apiVersion: "2.0",
      },
      query: {
        filters: [],
      },
      includeResultsetResponses: "HIT",
      pagination: {
        skip: 0,
        limit: 10,
      },
      testMode: false,
      requestedGranularity: "record",
    };

    let filterData = params.map((item) => {
      if (item.operator) {
        return {
          id: item.field,
          operator: item.operator,
          value: item.value,
        };
      } else {
        return {
          id: item.key ?? item.id,
          scope: selectedPathSegment,
        };
      }
    });

    filter.query.filters = filterData;

    return filter;
  };

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        borderRadius: "999px",
        textTransform: "none",
        fontSize: "14px",
        backgroundColor: config.ui.colors.primary,
        border: `1px solid ${config.ui.colors.primary}`,
        boxShadow: "none",
        "&:hover": {
          backgroundColor: "white",
          border: `1px solid ${config.ui.colors.primary}`,
          color: config.ui.colors.primary,
        },
      }}
      startIcon={<SearchIcon />}
      onClick={handleSearch}
      disabled={!isLoaded}
    >
      Search
    </Button>
  );
}
