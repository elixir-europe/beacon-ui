import { Box, Container, Typography, Stack, Chip, Divider, Alert, Link as MUILink } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function CodeBlock({ code, lang = "text" }: { code: string; lang?: string }) {
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
      <code>{`// ${lang}
${code}`}</code>
    </Box>
  );
}

export default function ComponentSearchBoxDocs() {
  return (
    <Container maxWidth="lg" id="component-search-box" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<SearchIcon />} label="Component: Search Box" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Search Box — how it works
      </Typography>
      <Typography color="text.secondary" paragraph>
        The Search Box is the starting point for finding data in Beacon‑UI. It guides you through three steps and
        automatically adapts to your deployment (single Beacon or Beacon Network) and to the result type you choose.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        1) Where does it get its options and send queries?
      </Typography>
      <Typography color="text.secondary" paragraph>
        Beacon‑UI reads a <strong>base API URL</strong> from your runtime configuration file (<code>/config/config.json</code>),
        shown here as <code>MY_API_URL</code>. With that base it uses a few standard endpoints:
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong><code>GET MY_API_URL/map</code></strong> — discovers available <em>result types</em> and fills the “Result type” buttons.
          (For example: <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/map" target="_blank" rel="noreferrer">/beacon-network/v2.0.0/map</MUILink>)
        </li>
        <li>
          <strong><code>GET MY_API_URL/configuration</code></strong> — loads additional configuration for those result types.
        </li>
        <li>
          <strong><code>GET MY_API_URL/info</code></strong> — shows environment details (e.g., member services in a Beacon Network).
        </li>
      </Box>
      <Alert severity="info" sx={{ my: 2 }}>
        Example base URLs you may see in production: {" "}
        <MUILink href="https://beacons.bsc.es/beacon/v2.0.0/" target="_blank" rel="noreferrer">https://beacons.bsc.es/beacon/v2.0.0/</MUILink>{" "}
        (single beacon) or {" "}
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/" target="_blank" rel="noreferrer">https://beacons.bsc.es/beacon-network/v2.0.0/</MUILink>{" "}
        (network). The Search Box sends requests to these, appending the selected path like <code>/individuals</code> or <code>/g_variants</code>.
      </Alert>

      <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
        2) Choosing a <em>Result type</em>
      </Typography>
      <Typography color="text.secondary" paragraph>
        The first step is picking <em>what</em> you want to search. Beacon‑UI reads your available categories from
        <code>GET MY_API_URL/map</code> and turns them into buttons. We show friendly names (e.g., “Genomic Variants” instead
        of technical IDs) and, if you configured a preferred order, we follow it.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li><strong>Genomic Variants</strong> — variant‑centric results across individuals.</li>
        <li><strong>Individuals</strong> — person‑level records (age, sex, phenotypes, etc.).</li>
        <li><strong>Biosamples</strong> — sample‑level records (tissue, histology, etc.).</li>
        <li><strong>Datasets / Cohorts / Runs / Analyses</strong> — catalogue‑style metadata.</li>
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        Details
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Source:</strong> categories come from the API <em>map</em> response (endpoint <code>/map</code>). In Beacon Networks this is the
          network base URL (e.g., <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/map" target="_blank" rel="noreferrer">/beacon-network/v2.0.0/map</MUILink>).
        </li>
        <li>
          <strong>Naming:</strong> technical IDs are shown with clearer labels. For example, <code>genomicVariations</code> appears as “Genomic Variants”.
        </li>
        <li>
          <strong>Uniqueness:</strong> we hide duplicates and keep one button per category.
        </li>
        <li>
          <strong>Order:</strong> you can control the order with <code>ui.entryTypesOrder</code> in <code>config.json</code>. If only one type is available,
          the step is skipped and the header becomes <em>“Search &lt;Type&gt;”</em>.
        </li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        3) The inputs you use
      </Typography>
      <Typography color="text.secondary" paragraph>
        Depending on the selected result type, you’ll see one or two inputs:
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Genomic query</strong> (only when Genomic Variants is available): lets you specify genome assembly and a region
          (e.g., <code>chr13:32315000-32317000</code>) and, if needed, reference/alternate alleles.
        </li>
        <li>
          <strong>Filtering terms</strong>: plain‑language filters such as sex (female/male), phenotype terms, biosample attributes, etc.
          Start typing to see suggestions, then add the ones you need.
        </li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Filtering terms — data source & how to use
      </Typography>
      <Typography color="text.secondary" paragraph>
        Filtering terms are the plain‑language criteria you add to refine a search (e.g., <em>female</em>, a phenotype, a tissue).
        Beacon‑UI fetches the available terms from your API at <code>MY_API_URL/filtering_terms</code> when the app starts.
        In network deployments this may come from the network base URL (often configured separately), for example:
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/filtering_terms" target="_blank" rel="noreferrer">/beacon-network/v2.0.0/filtering_terms</MUILink>.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li><strong>Type‑ahead suggestions:</strong> start typing and you’ll see matching terms. Each suggestion shows a friendly name and the internal ID.</li>
        <li><strong>Click to add:</strong> selecting a term adds it to your active filters. You can add multiple terms.</li>
        <li><strong>Terms that need a value:</strong> some terms are <em>alphanumeric</em> (e.g., <em>age</em>). You’ll be prompted to enter a value such as <code>&gt; 40</code> or <code>= 1970</code>.</li>
        <li><strong>Scopes:</strong> each term applies to a data level (e.g., <em>individual</em>, <em>biosample</em>). The UI automatically picks the right scope for your selected result type.</li>
      </Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Example (simplified) response from <code>…/filtering_terms</code>:
      </Typography>
      <CodeBlock
        lang="json"
        code={`{
  "response": {
    "filteringTerms": [
      { "id": "female", "type": "ontologyTerm", "scopes": ["individual"] },
      { "id": "age",    "type": "alphanumeric", "scopes": ["individual"] }
    ]
  }
}`}
      />

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        4) Where does it search?
      </Typography>
      <Typography color="text.secondary" paragraph>
        The Search Box sends your request to the <strong>selected path</strong> of your base API URL. For example, if you choose
        <em>Individuals</em> it calls <code>MY_API_URL/individuals</code>.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Single Beacon</strong>: {" "}
          <MUILink href="https://beacons.bsc.es/beacon/v2.0.0/individuals" target="_blank" rel="noreferrer">
            https://beacons.bsc.es/beacon/v2.0.0/individuals
          </MUILink>
        </li>
        <li>
          <strong>Beacon Network</strong>: {" "}
          <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/individuals" target="_blank" rel="noreferrer">
            https://beacons.bsc.es/beacon-network/v2.0.0/individuals
          </MUILink>
        </li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        5) Example request (Individuals filtered by <code>female</code>)
      </Typography>
      <Typography color="text.secondary" paragraph>
        Conceptually, when you choose <em>Individuals</em> and add the <em>female</em> filter, the request body looks like this:
      </Typography>
      <CodeBlock
        lang="json"
        code={`{
  "meta": { "apiVersion": "2.0" },
  "query": {
    "filters": [ { "id": "female", "scope": "individual" } ],
    "includeResultsetResponses": "HIT",
    "pagination": { "limit": 10, "skip": 0 },
    "requestedGranularity": "record",
    "testMode": false
  }
}`}
      />
      <Typography color="text.secondary" paragraph>
        On a Beacon Network, the URL would be {" "}
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/individuals" target="_blank" rel="noreferrer">
          /beacon-network/v2.0.0/individuals
        </MUILink>
        .
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        6) Run the search & see results
      </Typography>
      <Typography color="text.secondary" paragraph>
        Press <strong>Search</strong>. Beacon‑UI calls the endpoint and shows the table of results underneath with paging and counts.
        You can add/remove filters and run again to refine.
      </Typography>

      <Alert severity="info" sx={{ my: 2 }}>
        You can change endpoints and UI options in <code>public/config/config.json</code> — no rebuild required.
      </Alert>

      {/* Troubleshooting */}
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Troubleshooting
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li><strong>Missing result types</strong>: ensure <code>MY_API_URL/map</code> is reachable and returns the expected entries.</li>
        <li><strong>No results</strong>: try broader criteria or check service availability in <code>MY_API_URL/info</code>.</li>
        <li><strong>Login required</strong>: some deployments need sign‑in before returning data. Sign in and try again.</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">References:</Typography>
        <MUILink href="https://beacons.bsc.es/beacon/v2.0.0/individuals" target="_blank" rel="noreferrer">
          Example: single beacon /individuals
        </MUILink>
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/individuals" target="_blank" rel="noreferrer">
          Example: network /individuals
        </MUILink>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config.json" target="_blank" rel="noreferrer">
          config.json
        </MUILink>
      </Stack>
    </Container>
  );
}
