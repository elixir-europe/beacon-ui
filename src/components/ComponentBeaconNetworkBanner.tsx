import { Box, Container, Typography, Stack, Chip, Divider, Alert, Link as MUILink } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";

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

export default function ComponentBeaconNetworkBanner() {
  return (
    <Container maxWidth="lg" id="component-beacon-network-banner" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<HubIcon />} label="Component: Beacon Network Banner" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Beacon Network Banner — who’s in the network
      </Typography>
      <Typography color="text.secondary" paragraph>
        The <strong>Beacon Network Banner</strong> shows the logos of all member beacons in a network deployment. It loads once on
        page load, deduplicates logos, and displays them in a responsive row so users can quickly recognize participating
        organizations.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Data source */}
      <Typography variant="h5" gutterBottom>
        Where do the logos come from?
      </Typography>
      <Typography color="text.secondary" paragraph>
        On mount, the component requests <code>GET MY_API_URL/</code> (your network base URL). The response includes one entry per
        member beacon. From each entry, we extract <code>organization.logoUrl</code> and the <code>beaconId</code>. Example (simplified):
      </Typography>
      <CodeBlock
        code={`{
  "responses": [
    {
      "response": {
        "id": "beacon.example.org",
        "organization": {
          "logoUrl": "https://example.org/logo.png",
          "contactUrl": "mailto:info@example.org"
        }
      }
    },
    { "response": { "id": "beacon2.org", "organization": { "logoUrl": "https://beacon2.org/logo.svg" } } }
  ]
}`}
      />
      <Typography color="text.secondary" paragraph>
        Real‑world reference endpoint: <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/" target="_blank" rel="noreferrer">/beacon-network/v2.0.0/</MUILink>
      </Typography>

      {/* How it cleans & renders */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        How it cleans and renders the list
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Deduplication</strong>: if multiple entries share the same <code>logoUrl</code>, only one is shown.
        </li>
        <li>
          <strong>Fallback on errors</strong>: if an image fails to load, it is removed from the list so the banner never shows a broken logo.
        </li>
        <li>
          <strong>Responsive layout</strong>: logos are rendered with <code>object-fit: contain</code> and constrained sizes so they look sharp
          without distorting proportions.
        </li>
      </Box>

      <Alert severity="info" sx={{ my: 2 }}>
        This banner is intended for <strong>networkBeacon</strong> deployments only. In a <em>singleBeacon</em> app you can hide it or
        repurpose it to show local partners.
      </Alert>

      {/* UX & branding */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        UX & branding notes
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Alt text</strong>: each image uses the beacon ID for <code>alt</code>, which helps screen readers identify the logo owner.
        </li>
        <li>
          <strong>Brand consistency</strong>: the component uses your theme fonts and spacing; background is plain white by default to respect
          vendor brand colors.
        </li>
        <li>
          <strong>Optional linking</strong>: you can extend it to wrap each logo with a link to the beacon’s info page if your API provides URLs.
        </li>
      </Box>

      {/* Troubleshooting */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Troubleshooting
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>No logos shown</strong>: check that <code>CONFIG.apiUrl</code> points to the <em>network</em> base and that <code>GET /</code> returns
          a <code>responses</code> array with <code>organization.logoUrl</code> fields.
        </li>
        <li>
          <strong>Mixed HTTP/HTTPS</strong>: ensure all <code>logoUrl</code> values are HTTPS to avoid mixed‑content blocking in browsers.
        </li>
        <li>
          <strong>CORS</strong>: if logos are hosted on different domains, make sure they are publicly accessible; otherwise browsers may
          block them.
        </li>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">References:</Typography>
        <MUILink href="https://beacons.bsc.es/beacon-network/v2.0.0/" target="_blank" rel="noreferrer">
          Network base endpoint
        </MUILink>
      </Stack>
    </Container>
  );
}
