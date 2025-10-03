import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Divider,
  Alert,
  Link as MUILink,
  Paper,
  List,
  ListItem,
  ListItemText,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

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

export default function ComponentConfiguration() {
  return (
    <Container maxWidth="lg" id="component-configuration" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<SettingsIcon />} label="Configuration (config.json)" color="primary" />
      </Stack>

      <Typography variant="h3" fontWeight={800} gutterBottom>
        Configuration
      </Typography>
      <Typography color="text.secondary" paragraph>
        This page explains, in simple terms, how to configure the Beacon‑UI. You do not need to know programming. You will edit
        one file called <code>config.json</code> that the website reads when it starts.
      </Typography>

      <Alert severity="info" sx={{ my: 2 }}>
        <strong>Where is the file?</strong> Place it at <code>public/config/config.json</code>. The website loads it from
        <code> /config/config.json</code> when it opens.
      </Alert>

      <Typography variant="h5" gutterBottom>
        What you will do (3 steps)
      </Typography>
      <List>
        <ListItem><ListItemText primary="1) Open the file in a text editor (Notepad, VS Code, etc.)." /></ListItem>
        <ListItem><ListItemText primary="2) Fill the fields below using this guide." /></ListItem>
        <ListItem><ListItemText primary="3) Save the file and refresh the website (hard refresh if needed)." /></ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Quick reference table
      </Typography>
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Table size="small" aria-label="config table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Key</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>What it means</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Example</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Used by</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>beaconType</TableCell>
              <TableCell>Type of site: a <em>network</em> of many beacons or a single beacon.</TableCell>
              <TableCell><code>"networkBeacon"</code> or <code>"singleBeacon"</code></TableCell>
              <TableCell>Navbar, Results Table, Network Banner</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>apiUrl</TableCell>
              <TableCell>Main API base used for searches and info.</TableCell>
              <TableCell><code>https://beacons.bsc.es/beacon-network/v2.0.0</code></TableCell>
              <TableCell>Search Box, Results, Info/Logos</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>apiUrlNetwork</TableCell>
              <TableCell>Alternative network API for specific features (e.g., filtering terms).</TableCell>
              <TableCell><code>https://.../beacon-network/v2.0.0</code></TableCell>
              <TableCell>Filtering Terms</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>apiUrlSingle</TableCell>
              <TableCell>Base API when running a single beacon site.</TableCell>
              <TableCell><code>https://beacon-spain.ega-archive.org/api</code></TableCell>
              <TableCell>Search Box (single)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>assemblyId</TableCell>
              <TableCell>Genome build(s) available for genomic queries.</TableCell>
              <TableCell><code>["GRCh38", "GRCh37"]</code></TableCell>
              <TableCell>Search Box (genomic input)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>oidcUrl / oidcClientId</TableCell>
              <TableCell>Sign‑in service details (only if you have login).</TableCell>
              <TableCell><code>https://.../auth/realms/beacon</code></TableCell>
              <TableCell>Login/Protected endpoints</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>loginRequired</TableCell>
              <TableCell>Whether users must sign in to run searches or see details.</TableCell>
              <TableCell><code>false</code></TableCell>
              <TableCell>Search, Downloads</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>appUrl</TableCell>
              <TableCell>Public web address of this site (used in redirects).</TableCell>
              <TableCell><code>https://beacons.bsc.es/</code></TableCell>
              <TableCell>Auth redirects</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ui.*</TableCell>
              <TableCell>Branding and behavior (title, colors, menus, logos).</TableCell>
              <TableCell>See sections below</TableCell>
              <TableCell>Navbar, Buttons, Tables</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Fill the basic fields
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>beaconType</strong> — Choose <em>networkBeacon</em> if your site shows results from many organizations; choose
          <em> singleBeacon</em> if it is just one.
        </li>
        <li>
          <strong>apiUrl</strong> — Ask your backend team for the correct address. It usually ends with <code>/beacon-network/v2.0.0</code>
          (network) or <code>/beacon/v2.0.0</code> (single). Paste the whole address starting with <code>https://</code>.
        </li>
        <li>
          <strong>assemblyId</strong> — Keep the genome builds that your data supports. The first one in the list becomes the default.
        </li>
        <li>
          <strong>oidcUrl / oidcClientId</strong> — If you do not use login, you can leave them as they are. If you do, copy the values
          provided by your identity provider.
        </li>
        <li>
          <strong>loginRequired</strong> — Set to <code>true</code> only if searches should require sign‑in.
        </li>
        <li>
          <strong>appUrl</strong> — The public URL where people visit your site.
        </li>
      </Box>

      <Alert severity="warning" sx={{ my: 2 }}>
        Use <strong>HTTPS</strong> addresses everywhere. Mixed HTTP/HTTPS can make images or API calls fail in modern browsers.
      </Alert>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Make it look right (branding)
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>ui.title</strong> — The title shown on the homepage and header.
        </li>
        <li>
          <strong>ui.entryTypesOrder</strong> — The order of the big “Result type” buttons in the Search Box (e.g., Individuals first,
          then Genomic variants). Move items in the list to change the order.
        </li>
        <li>
          <strong>ui.showAboutPage / ui.showContactPage</strong> — Show/hide About and Contact links in the Navbar.
        </li>
        <li>
          <strong>ui.colors</strong> — Brand colors. They are 6‑digit hex codes like <code>#023452</code>. Primary is used most often (buttons,
          table headers), secondary/tertiary are accents.
        </li>
        <li>
          <strong>ui.logos</strong> — Paths to your images. Put the image files under <code>public/assets/logos/</code> and reference them as
          <code> /assets/logos/your_logo.png</code>.
        </li>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Quick filters for users (ui.commonFilters)
      </Typography>
      <Typography color="text.secondary" paragraph>
        These are the clickable chips (e.g., Female, COVID‑19) that appear under topics like Demographics or Cancer. They help
        users start a search without typing.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>filterCategories</strong> — The topics (accordion titles): e.g., Demographics, Cancer, COVID.
        </li>
        <li>
          <strong>filterLabels</strong> — The chips inside each topic. Each label has:
          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            <li><em>label</em> — the text users see (e.g., Female).</li>
            <li><em>type</em> — <strong>ontology</strong> (a controlled dictionary term like an NCIT code) or <strong>alphanumeric</strong>
                (a free‑text/number field where the user will add a value, e.g., Age).</li>
            <li><em>id</em> — the code the system sends to the server (e.g., <code>NCIT:C16576</code> for Female).</li>
            <li><em>scopes</em> (optional) — which data level it applies to (e.g., <em>individual</em>, <em>biosample</em>, <em>cohort</em>).</li>
          </Box>
        </li>
      </Box>
      <Alert severity="info" sx={{ my: 2 }}>
        If a label looks like a placeholder (for example <code>label6</code>), the UI hides it automatically.
      </Alert>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Variant shortcuts (ui.genomicAnnotations)
      </Typography>
      <Typography color="text.secondary" paragraph>
        Decide which groups of genomic annotations to show as quick chips (e.g., SNP examples, CNV examples, Molecular effect).
        List the group names in <code>visibleGenomicCategories</code> to make them appear.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Example file (ready to use)
      </Typography>
      <CodeBlock
        code={`{
  "beaconType": "networkBeacon",
  "apiUrl": "https://beacons.bsc.es/beacon-network/v2.0.0",
  "apiUrlNetwork": "https://beacon-network-backend-demo.ega-archive.org/beacon-network/v2.0.0",
  "apiUrlSingle": "https://beacon-spain.ega-archive.org/api",
  "assemblyId": ["GRCh38", "GRCh37", "NCBI36"],
  "oidcUrl": "https://beacons.bsc.es/auth/realms/beacon",
  "oidcClientId": "beacon-network-ui",
  "loginRequired": false,
  "appUrl": "https://beacons.bsc.es/",
  "variationType": ["DEL (Copy Number Loss)", "SNP (Single Nucleotide Polymorphism)", "DUP", "BND"],
  "ui": {
    "title": "ELIXIR Beacon Network Browser",
    "entryTypesOrder": ["individuals", "g_variants", "biosamples", "runs", "analyses", "cohorts", "datasets"],
    "showExternalNavBarLink": false,
    "showAboutPage": true,
    "showContactPage": true,
    "colors": { "primary": "#023452", "darkPrimary": "#023452", "secondary": "#f47d20", "tertiary": "#bebf32" },
    "logos": {
      "main": "/assets/logos/elixir.png",
      "mainSecondary": "assets/logos/maingrey.svg",
      "founders": [
        "/assets/logos/founder1.svg",
        "/assets/logos/founder2.svg",
        "/assets/logos/founder3.svg"
      ]
    },
    "commonFilters": {
      "filterCategories": ["Demographics", "Cancer", "COVID"],
      "filterLabels": {
        "Demographics": [
          { "key": "female", "id": "NCIT:C16576", "label": "Female", "type": "ontology" },
          { "key": "male", "id": "NCIT:C20197", "label": "Male", "type": "ontology" },
          { "key": "age_of_onset", "id": "age_of_onset", "label": "Age Of Onset", "type": "alphanumeric" }
        ]
      }
    },
    "genomicAnnotations": { "visibleGenomicCategories": ["SNP Examples", "CNV Examples", "Protein Examples", "Molecular Effect"] }
  }
}`}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Save, reload & verify (checklist)
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>Save the file. Open <code>/config/config.json</code> in your browser — you should see your JSON.</li>
        <li>Reload the website. If nothing changes, do a <strong>hard refresh</strong> (Ctrl/Cmd + Shift + R).</li>
        <li>Check: title on the homepage, Navbar About/Contact links, Search Box result type order, brand colors, logos.</li>
        <li>Run a simple search (e.g., Individuals) to confirm the API URL is correct.</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Troubleshooting (plain language)
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li><strong>I changed the file but nothing happens</strong> — hard refresh; ensure the file is at <code>public/config/config.json</code>.</li>
        <li><strong>Search fails</strong> — check <code>apiUrl</code> is correct and reachable; ask backend to enable CORS for your site.</li>
        <li><strong>Logos don’t show</strong> — the paths must start with <code>/assets/</code> and the files must be under <code>public/assets/</code>.</li>
        <li><strong>Login doesn’t work</strong> — confirm <code>oidcUrl</code>, <code>oidcClientId</code>, and that <code>appUrl</code> matches the site URL.</li>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">Reference:</Typography>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config.json" target="_blank" rel="noreferrer">
          Example config.json (repository)
        </MUILink>
      </Stack>
    </Container>
  );
}