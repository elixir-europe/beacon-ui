import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Link,
  Button
} from "@mui/material";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import DownloadIcon from '@mui/icons-material/Download';
import LoadingButton from "@mui/lab/LoadingButton";
import ResultsTableModalBody from './ResultsTableModalBody';
import CloseIcon from "@mui/icons-material/Close";
import { InputAdornment, IconButton } from "@mui/material";
import { useSelectedEntry } from "../../context/SelectedEntryContext";
import Loader from "../../common/Loader";
import Papa from "papaparse";
import { PATH_SEGMENT_TO_ENTRY_ID } from "../../common/textFormatting";
import { useAuth } from "react-oidc-context";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  pt: '15px',
};

const ResultsTableModal = ({ open, subRow, onClose }) => {
  const { selectedPathSegment, selectedFilter } = useSelectedEntry();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataTable, setDataTable] = useState([]);
  const [url, setUrl] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const entryTypeId = PATH_SEGMENT_TO_ENTRY_ID[selectedPathSegment];

  const auth = useAuth();
  
  const isLogged = auth.isAuthenticated && !auth.user?.expired;
  
  const token = isLogged ? auth.user?.access_token : null;

  const parseType = (item) => {
    switch(item) {
      case 'dataset':
        return 'datasets';
      default:
        return null;
    }
  }

  const tableType = parseType(subRow.setType);

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  }

  const handleClose = () => {
    setPage(0);
    setRefreshTrigger(prev => prev + 1);
    onClose();
  };

  function summarizeValueText(value) {
    if (value == null) return "";
    if (Array.isArray(value)) {
      return value.map(summarizeValueText).filter(Boolean).join(" | ");
    }
    if (typeof value === "object") {
      if (value.label) return String(value.label);
      if (value.id) return String(value.id);
      const nested = Object.values(value).map(summarizeValueText).filter(Boolean);
      return nested.join(", ");
    }
    return String(value);
  }

  async function buildDownloadRows(sortedHeaders, cleanAndParseInfo) {
    try {
      setLoadingDownload(true);
      const url = `${CONFIG.apiUrl}/${tableType}/${subRow.id}/${selectedPathSegment}`;

      let query = queryBuilder(page, entryTypeId);

      if (query?.pagination) {
        query.pagination.limit = 5000;
      }

      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
      };

      if(token && token !== "undefined") {
        requestOptions.headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();
      const beaconResults = data.response?.resultSets;

      const beacon = beaconResults.find((item) => {
        const id = subRow.beaconId || subRow.id;
        const itemId = item.beaconId || item.id;
        return id === itemId;
      });

      let cleanResults = beacon.results;

      return cleanResults.map((item, index) => {
        let id = item.id ?? `row_${index}`;
        const parsedInfo = cleanAndParseInfo?.(item.info);

        if (parsedInfo?.sampleID) id += `_${parsedInfo.sampleID}`;
        else id += `_${index}`;

        const row = {};

        sortedHeaders.forEach((h) => {
          const rawValue = item[h.id];
          row[h.name ?? h.id] = summarizeValueText(rawValue);
        });

        row.__rowKey = id;
        return row;
      });
    } catch(err) {
      console.log("Failed download dataset: " , err);
    } finally {
      setLoadingDownload(false);
    }
  }

  const headersSet = new Set();

  dataTable.forEach(obj => {
    Object.keys(obj).forEach(key => {
      headersSet.add(key);
    });
  });

  const headers = Array.from(headersSet);

  const indexedHeaders = {};
  headers.forEach((header, index) => {
    indexedHeaders[index] = {
      id: header,
      name: formatHeaderName(header)
    };
  });

  function formatHeaderName(header) {
    const withSpaces = header.replace(/([A-Z])/g, ' $1');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  const headersArray = Object.values(indexedHeaders);
  const primaryId = headersArray.find(h => h.id === "id") 
    ? "id" 
    : headersArray.find(h => h.id === "variantInternalId") 
    ? "variantInternalId" 
    : null;

  const sortedHeaders = primaryId
    ? [
        ...headersArray.filter(h => h.id === primaryId),
        ...headersArray.filter(h => h.id !== primaryId)
      ]
    : headersArray;

  const cleanAndParseInfo = (infoString) => {
    try {
      if (typeof infoString !== "string") return null;

      const cleaned = infoString.replace(/"|"/g, '"');
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (error) {
      console.log("Failed to parse item.info:", error);
      return null;
    }
  };

  const handleDownload = async () => {
    const rows = await buildDownloadRows(sortedHeaders, cleanAndParseInfo);
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const fileName = `${subRow.beaconId}___${subRow.id}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  const queryBuilder = (page, entryTypeId) => {
    let skipItems = page * rowsPerPage;

    let filter = {
      meta: {
        apiVersion: "2.0",
      },
      query: {
        filters: [],
        includeResultsetResponses: "HIT",
        pagination: {
          skip: parseInt(`${(skipItems)}`),
          limit: parseInt(`${(rowsPerPage)}`),
        },
        testMode: false,
        requestedGranularity: "record",
      },
    };

    if(selectedFilter.length > 0) {
      let filterData = selectedFilter.map((item) =>
      {
          if(item.operator) {
            return {
              id: item.field,
              operator: item.operator,
              value: item.value
            }
          } else {
            return {
              id: item.key ?? item.id,
              scope: entryTypeId
            }
          }
        }
      );
      filter.query.filters = filterData;
    }
    return filter;
  }

  useEffect(() => {
    const fetchTableItems = async () => {
      try {
        setLoading(true);
        const url = `${CONFIG.apiUrl}/${selectedPathSegment}`;
        setUrl(url);
        let query = queryBuilder(page, entryTypeId);

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(query)
        };
        
        if(token && token !== "undefined") {
          requestOptions.headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        const results = data.response?.resultSets;

        const beacon = results.find((item) => {
          const id = subRow.beaconId || subRow.id;
          const itemId = item.beaconId || item.id;
          return id === itemId;
        });
        
        const totalDatasetsPages = Math.ceil(beacon.resultsCount / rowsPerPage);
        
        setTotalItems(beacon.resultsCount);
        setTotalPages(totalDatasetsPages)
        setDataTable(beacon.results);
      } catch (err) {
        console.error("Failed to fetch modal table", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTableItems();
  }, [subRow, page, rowsPerPage, refreshTrigger]);

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Fade in={open}>
        <Box sx={style}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <InputAdornment position="end">
              <IconButton
                onClick={() => handleClose()}
                size="small"
                sx={{ color: CONFIG.ui.colors.darkPrimary }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          </Box>
          <Box>
            <Typography id="modal-modal-title" 
              sx={{ 
                fontWeight: "bold",
                fontSize: "17px",
                paddingBottom: "10px",
                color: `${ CONFIG.ui.colors.darkPrimary }`
              }}>
              Results detailed table
            </Typography>
          </Box>
          <Box>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 0.5fr'
              }}>
              <Box >
                <Box>
                  { subRow.beaconId  && (
                    <Box
                      sx={{
                        display: "flex"
                      }}>
                      <Typography sx={{
                        color: "black",
                        fontSize: "15px",
                        paddingRight: "10px",
                        color: `${ CONFIG.ui.colors.darkPrimary }`
                      }}>
                        Beacon:
                      </Typography>
                      <Typography sx={{
                        color: "black",
                        fontWeight: 700,
                        fontSize: "15px",
                        color: `${ CONFIG.ui.colors.darkPrimary }`
                      }}>
                        { subRow.beaconId }
                      </Typography>
                    </Box>
                  )}
                  { subRow.id  && (
                    <Box
                      sx={{
                        display: "flex",
                        paddingTop: "1px",
                        paddingBottom: "10px"
                      }}>
                      <Typography sx={{
                        color: `${ CONFIG.ui.colors.darkPrimary }`,
                        fontSize: "15px",
                        paddingRight: "10px",
                      }}>
                        Dataset:
                      </Typography>
                      <Typography sx={{
                        color: `${ CONFIG.ui.colors.darkPrimary }`,
                        fontWeight: 700,
                        fontSize: "15px",
                      }}>
                        { subRow.id }
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ paddingBottom: "15px" }}>
                  <Typography sx={{
                    color: `${ CONFIG.ui.colors.darkPrimary }`,
                    fontWeight: 700,
                    fontSize: "13px",
                    fontStyle: "italic"
                  }}>
                    <Link href={url} color="inherit" underline="hover" target="_blank" rel="noopener noreferrer">
                      { url }
                    </Link>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'end'
                }}>
                  { !loading &&
                    <LoadingButton
                        variant="contained"
                        onClick={handleDownload}
                        startIcon={<DownloadIcon />}
                        aria-label="Download dataset"
                        loading={loadingDownload}
                        sx={{
                          backgroundColor: CONFIG.ui.colors.darkPrimary,
                          height: "30px",
                          "&:hover": { backgroundColor: CONFIG.ui.colors.darkPrimary },
                          "&:focus-visible": { outline: "2px solid #000", outlineOffset: 2 },
                        }}
                      >
                        Download
                    </LoadingButton>
                  }
              </Box>
            </Box>
            <Box>
              { loading && (<Loader message="Loading data..." />)}
              { !loading && dataTable.length>0 && (
                <>
                  <ResultsTableModalBody 
                    dataTable={dataTable}
                    totalItems={totalItems}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalPages={totalPages}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    primary={ CONFIG.ui.colors.primary }
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ResultsTableModal;