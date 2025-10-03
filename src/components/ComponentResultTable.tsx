import { Box, Container, Typography, Stack, Chip, Divider, Alert, Link as MUILink } from "@mui/material";
import TableChartIcon from "@mui/icons-material/TableChart";

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  return (
    <Box
      component="pre"
      sx={{
        p: 2,
        borderRadius: 2,
        overflow: "auto",
        fontSize: 13,
        lineHeight: 1.6,
        border: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: (t) => (t.palette.mode === "dark" ? "#0F172A80" : "#F1F5F9"),
      }}
    >
      <code>{`// ${lang}\n${code}`}</code>
    </Box>
  );
}

export default function ComponentResultTable() {
  return (
    <Container maxWidth="lg" id="component-results-table" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<TableChartIcon />} label="Component: Results Table" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Results Table — what it shows
      </Typography>
      <Typography color="text.secondary" paragraph>
        The Results Table displays the outcome of your search. Each row summarizes results for a beacon (in a Beacon Network)
        or for your single service (single‑beacon deployments). You can expand rows for details and open a modal when available.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Data sources */}
      <Typography variant="h5" gutterBottom>
        Where does the data come from?
      </Typography>
      <Typography color="text.secondary" paragraph>
        After you press <em>Search</em>, Beacon‑UI sends your query to <code>MY_API_URL/&lt;resultType&gt;</code> (for example,
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/individuals" target="_blank" rel="noreferrer">/beacon-network/v2.0.0/individuals</MUILink>),
        then formats the responses into <code>resultData</code>. Additional information about each beacon (logo and contact) comes from
        <code>MY_API_URL/info</code> and is exposed in <code>beaconsInfo</code>.
      </Typography>

      <CodeBlock
        code={`// Simplified shape used by the table (one item per beacon or service)
{
  beaconId: "beacon.example.org",         // or id
  exists: true,                            // production vs development flag
  totalResultsCount: 1234,                 // total matching records
  items: [ { datasetId: "DS-001", count: 45 }, ... ], // optional per-dataset detail
  description: "Human readable name",     // optional; shown in tooltip
  info: { /* may include error info */ }
}`}
      />

      <Alert severity="info" sx={{ my: 2 }}>
        <strong>Single Beacon vs Beacon Network:</strong> in networks, each row represents one member beacon; in single‑beacon
        deployments, the columns adapt to show what’s relevant for your service.
      </Alert>

      {/* Columns */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Columns & what they mean
      </Typography>
      <Typography color="text.secondary" paragraph>
        Columns are defined centrally (via <code>BEACON_NETWORK_COLUMNS</code> or <code>BEACON_SINGLE_COLUMNS</code>). Typical columns include:
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Beacon / Service</strong> — the beacon identifier. If available, we show the organization <em>logo</em> and a tooltip with
          its <em>description</em>. A warning icon may appear if the backend reported an error.
        </li>
        <li>
          <strong>Environment</strong> — “Production Beacon” or “Development” (based on the <code>exists</code> flag in the response).
        </li>
        <li>
          <strong>Datasets</strong> — how many datasets contributed results (from <code>items.length</code>), if provided by the API.
        </li>
        <li>
          <strong>Total results</strong> — total number of records that matched your query (<code>totalResultsCount</code>), formatted using your locale.
        </li>
        <li>
          <strong>Contact</strong> — a mail button if the beacon exposes a contact address in <code>/info</code> (opens your email client).
        </li>
      </Box>
      <Typography color="text.secondary" paragraph>
        For single‑beacon deployments the exact set of columns may differ, as defined in <code>BEACON_SINGLE_COLUMNS</code>.
      </Typography>

      {/* Interactions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        How to interact with the table
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Expand a row</strong> — click a row to toggle details (arrow icon up/down). This shows per‑dataset or per‑entry information
          using the nested view.
        </li>
        <li>
          <strong>Open details modal</strong> — when available, click the grid icon to open a modal with a richer view of the selected row
          (lazy‑loaded for performance). In the provided implementation this is primarily used in single‑beacon mode.
        </li>
        <li>
          <strong>Contact a beacon</strong> — click the mail icon to open an email to the beacon’s contact address.
        </li>
        <li>
          <strong>Tooltips</strong> — hover the info or warning icons to read descriptions or error messages (when present).
        </li>
      </Box>

      {/* Visual behavior */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Visual behavior & customization
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Sticky header</strong> — column headers stay visible while you scroll.
        </li>
        <li>
          <strong>Hover highlight</strong> — rows are highlighted using a light shade of your primary color (from <code>CONFIG.ui.colors.primary</code>).
        </li>
        <li>
          <strong>Branding</strong> — the logo and contact URL are derived from <code>/info</code> (organization fields) when available.
        </li>
        <li>
          <strong>Columns</strong> — widths, labels, and alignment are defined in <code>BEACON_*_COLUMNS</code>. Adjust those constants to customize the table.
        </li>
      </Box>

      {/* Error notes */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Notes on errors & empty states
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          If the backend includes an error for a beacon, a warning icon appears. Hover to read the error code/message.
        </li>
        <li>
          If no datasets contributed results, the Datasets column shows <code>-</code>. The same applies when there are no total results.
        </li>
        <li>
          The modal and nested details only appear when the data contains the corresponding sections.
        </li>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Example — one network row
      </Typography>
      <CodeBlock
        code={`{
  "beaconId": "beacon.example.org",
  "exists": true,
  "items": [ { "datasetId": "DS-001", "count": 45 } ],
  "totalResultsCount": 1234,
  "description": "Example Beacon",
  "info": {}
}`}
      />

      <Alert severity="info" sx={{ my: 2 }}>
        Related pieces in the UI: the nested view is handled by <strong>ResultsTableRow</strong>, and the modal by
        <strong> ResultsTableModal</strong> (loaded on demand). If you need their docs, we can add them next.
      </Alert>

      <Divider sx={{ my: 3 }} />

      {/* Expanded rows (ResultsTableRow) */}
      <Typography variant="h5" gutterBottom>
        Expanded rows — per‑dataset breakdown
      </Typography>
      <Typography color="text.secondary" paragraph>
        Clicking a row expands a nested table that lists the datasets which contributed results. This view is meant for a
        quick overview and to jump into details when needed.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>View dataset details</strong> — the grid icon opens the details modal for that beacon/dataset pair.
        </li>
        <li>
          <strong>Dataset name</strong> — the dataset identifier provided by the API (shown as <em>Dataset: &lt;id&gt;</em>).
        </li>
        <li>
          <strong>Results count</strong> — per‑dataset count when available; otherwise a dash (<code>-</code>).
        </li>
      </Box>
      <Typography color="text.secondary" paragraph>
        Column layout in the expanded view is controlled by <code>BEACON_NETWORK_COLUMNS_EXPANDED</code>.
      </Typography>

      {/* Details modal (ResultsTableModal) */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Details modal — focused table with pagination & download
      </Typography>
      <Typography color="text.secondary" paragraph>
        The modal opens a richer table for the selected <em>beacon</em> and <em>dataset</em>. It fetches data directly from your API and
        supports paging and CSV export.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Data source</strong>: a POST request to <code>MY_API_URL/&lt;tableType&gt;/&lt;datasetId&gt;/&lt;resultType&gt;</code>. For datasets, the path is
          <code>/datasets/&lt;datasetId&gt;/&lt;resultType&gt;</code> (e.g., <em>individuals</em>, <em>g_variants</em>).
        </li>
        <li>
          <strong>Payload</strong>: includes <code>meta.apiVersion: "2.0"</code>, <code>query.filters</code> (your active filters),
          <code>pagination</code> (<em>skip</em> & <em>limit</em>), <code>requestedGranularity: "record"</code>, and <code>includeResultsetResponses: "HIT"</code>.
        </li>
        <li>
          <strong>Auth</strong>: if the user is signed in, a Bearer token is added to the request headers. Some deployments require sign‑in to
          access record‑level data or larger result sets.
        </li>
        <li>
          <strong>CSV download</strong>: exports the currently fetched records; the implementation requests up to 5,000 rows per download to
          keep files manageable.
        </li>
        <li>
          <strong>Provenance</strong>: the modal shows the exact endpoint URL it queried so users can reproduce the call.
        </li>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
        Example POST body (records granularity)
      </Typography>
      <CodeBlock
        code={`{
  "meta": { "apiVersion": "2.0" },
  "query": {
    "filters": [
      { "id": "female", "scope": "individual" }
    ],
    "includeResultsetResponses": "HIT",
    "pagination": { "skip": 0, "limit": 10 },
    "requestedGranularity": "record",
    "testMode": false
  }
}`}
      />
      <Alert severity="info" sx={{ my: 2 }}>
        The modal matches the selection in the main table: it focuses on one beacon (or service) and one dataset, and then
        paginates through the matching records.
      </Alert>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">References:</Typography>
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/info" target="_blank" rel="noreferrer">
          /info (organization logo / contact)
        </MUILink>
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/individuals" target="_blank" rel="noreferrer">
          Example results endpoint
        </MUILink>
      </Stack>
    </Container>
  );
}
