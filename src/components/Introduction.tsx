import { Box, Typography, Stack, Chip, Alert, Link as MUILink } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function Introduction() {
  return (
    <Box id="introduction" sx={{ scrollMarginTop: 96, paddingBottom: 6 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<InfoIcon />} label="Introduction" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        What is Beacon-UI?
      </Typography>

      <Typography color="text.secondary" paragraph>
        <strong>Beacon-UI</strong> is the user interface of the{" "}
        <MUILink href="https://beacons.bsc.es/" target="_blank" rel="noopener noreferrer">
          ELIXIR Beacon Network
        </MUILink>
        . It allows researchers and clinicians to explore and query genomic data across a
        distributed network of <em>Beacon</em> services while respecting privacy and access
        control rules.
      </Typography>

      <Typography color="text.secondary" paragraph>
        Designed as a modern <strong>React</strong> application, Beacon-UI provides:
      </Typography>

      <ul style={{ color: "var(--mui-palette-text-secondary)" }}>
        <li>
          A clean and responsive interface for browsing and filtering variant and dataset
          information.
        </li>
        <li>Integration with <strong>OIDC authentication</strong> for secure user access.</li>
        <li>
          Simple configuration via <code>JSON</code> files to adapt endpoints and branding to
          your organization.
        </li>
        <li>
          Easy deployment using <strong>Docker</strong> or a development setup with{" "}
          <code>docker-compose</code>.
        </li>
      </ul>

      <Alert severity="info" sx={{ mt: 2 }}>
        This documentation will guide you through <strong>installation</strong>,{" "}
        <strong>configuration</strong>, and <strong>development</strong> of Beacon-UI so you
        can run your own instance or contribute to its evolution.
      </Alert>
    </Box>
  );
}
