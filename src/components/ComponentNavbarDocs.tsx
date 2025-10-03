import { Box, Container, Typography, Stack, Chip, Divider, Alert, Link as MUILink } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";

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

export default function ComponentNavbarDocs() {
  return (
    <Container maxWidth="lg" id="component-navbar" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<NavigationIcon />} label="Component: Navbar" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Navbar — what it is
      </Typography>
      <Typography color="text.secondary" paragraph>
        The Navbar is the top bar of Beacon‑UI. It shows the project name and a small set of links. On phones it collapses into a menu.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Where do the links come from?
      </Typography>
      <Typography color="text.secondary" paragraph>
        Links are defined in your runtime configuration file (<code>/config/config.json</code>). Beacon‑UI reads that file when it starts and builds the Navbar from a few simple options:
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>External links</strong> — add your own links via <code>ui.externalNavBarLink</code> and enable them with <code>ui.showExternalNavBarLink</code>.
        </li>
        <li>
          <strong>About / Contact</strong> — turn these on with <code>ui.showAboutPage</code> and <code>ui.showContactPage</code>.
        </li>
        <li>
          <strong>Network Members</strong> — appears only when <code>beaconType</code> is <code>"networkBeacon"</code>.
        </li>
      </Box>

      <Alert severity="info" sx={{ my: 2 }}>
        Order matters: external links are shown <em>first</em>, then the built‑in items (Network Members, About, Contact).
      </Alert>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Quick example (copy into <code>config.json</code>)
      </Typography>
      <CodeBlock
        code={`{
  "beaconType": "networkBeacon",
  "ui": {
    "showAboutPage": true,
    "showContactPage": false,
    "showExternalNavBarLink": true,
    "externalNavBarLink": [
      { "label": "Docs",   "url": "https://beacons.bsc.es/" },
      { "label": "GitHub", "url": "https://github.com/elixir-europe/beacon-ui" }
    ]
  }
}`}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        How it behaves
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Opens external links in a new tab</strong> (URLs starting with <code>http</code>).
        </li>
        <li>
          <strong>Responsive</strong>: turns into a drawer menu on small screens.
        </li>
        <li>
          <strong>Accessible</strong>: items are real links with clear labels.
        </li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Tips
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>Keep 3–5 items for clarity; use short, meaningful labels.</li>
        <li>Use the <em>Branding</em> page to adjust the logo/title rather than adding them as links.</li>
        <li>Avoid deep menus; the Navbar is for quick entry points.</li>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Troubleshooting
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li><strong>My links don’t show up</strong>: check <code>ui.showExternalNavBarLink</code> and that <code>ui.externalNavBarLink</code> is an array of objects with a non‑empty <code>label</code>.</li>
        <li><strong>“Network Members” is missing</strong>: set <code>beaconType</code> to <code>"networkBeacon"</code>.</li>
        <li><strong>Changes don’t apply</strong>: ensure <code>/config/config.json</code> is served with <em>no‑cache</em> and refresh the page.</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary">References:</Typography>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config.json" target="_blank" rel="noreferrer">
          config.json (ui.* keys)
        </MUILink>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/src/nav/useNavItems.js" target="_blank" rel="noreferrer">
          useNavItems.js (Navbar items logic)
        </MUILink>
      </Stack>
    </Container>
  );
}