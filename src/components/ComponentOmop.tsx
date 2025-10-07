import {
  Box,
  Typography,
  Stack,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import TuneIcon from "@mui/icons-material/Tune";
import DescriptionIcon from "@mui/icons-material/Description";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

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

export default function ComponentOmop() {
  const CFG: any = (globalThis as any).CONFIG ?? {};
  const omopEnabled = CFG?.omop === true;

  return (
    <Box id="component-omop" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<ScienceIcon />} label="Beacon OMOP" color="primary" />
      </Stack>

      <Typography variant="h3" fontWeight={800} gutterBottom>
        OMOP support — how to enable it and how filters work
      </Typography>

      <Typography color="text.secondary" paragraph>
        Beacon-UI can expose an <strong>OMOP-specific filters panel</strong> on the right side of the
        search area. This helps users apply criteria based on medical concepts (e.g., lab
        values, diagnoses) using a simple dropdown + slider or checkbox — no coding needed.
      </Typography>

      <Alert severity={omopEnabled ? "success" : "info"} sx={{ mb: 2 }}>
        {omopEnabled ? (
          <>OMOP is <strong>enabled</strong> in your runtime config.</>
        ) : (
          <>
            OMOP is currently <strong>disabled</strong>. Add <code>"omop": true</code> to your{" "}
            <code>public/config/config.json</code> to enable it.
          </>
        )}
      </Alert>
    
      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        1) Enable OMOP in <code>config.json</code>
      </Typography>
      <Typography color="text.secondary" paragraph>
        Add the <code>omop</code> flag at the top level of your config file. When set to{" "}
        <code>true</code>, the UI renders an extra panel called <em>“OMOP filters”</em> on the right.
      </Typography>

      <CodeBlock
        code={`{
  "beaconType": "networkBeacon",
  "apiUrl": "https://.../beacon-network/v2.0.0",
  // ...
  "omop": true,             // ✅ turn OMOP on
  "ui": {
    "title": "ELIXIR Beacon Network Browser",
    // ...
  }
}`}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        2) Where OMOP filters come from
      </Typography>
      <Typography color="text.secondary" paragraph>
        The list of filters is defined in a JSON file served statically at{" "}
        <code>/config/omop_filters_grouped.json</code> (place it in{" "}
        <code>public/config/omop_filters_grouped.json</code>). The UI loads it on demand and shows:
      </Typography>

        <Box 
          sx={{
            display: "flex"
          }}
        >
          <Box 
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <List sx={{ color: "text.secondary" }}>
            <ListItem>
              <ListItemText
                primary="Group (first dropdown)"
                secondary="Select the clinical domain or concept group (e.g., CSF analytes, Laboratory tests, Conditions…)."
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Filter (second dropdown)"
                secondary="Choose a specific OMOP concept from the selected group. Each filter defines its input type: checkbox, range (slider), text, or select."
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Units chip (optional)"
                secondary='If the filter label contains units in brackets (for example, "Glucose [Mass/volume] in Cerebral spinal fluid"), a small units chip is shown next to the control.'
              />
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Slider range"
                secondary="For range filters, the slider shows the allowed minimum and maximum. The value labels display the current selection (e.g., Min: 0, Max: 38)."
              />
            </ListItem>
          </List>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <DescriptionIcon fontSize="small" />
                <Typography fontWeight={700}>Minimal example of <code>omop_filters_grouped.json</code></Typography>
              </Stack>
              <CodeBlock
                code={`{
  "groups": [
    {
      "group_id": "labs",
      "label": "Laboratory tests",
      "filters": [
        { "id": "glucose", "label": "Glucose [mg/dL]", "ui_type": "range" },
        { "id": "crp",     "label": "C-Reactive Protein [mg/L]", "ui_type": "range" },
        { "id": "diabetes_dx", "label": "Diabetes diagnosis", "ui_type": "checkbox" }
      ]
    },
    {
      "group_id": "conditions",
      "label": "Conditions",
      "filters": [
        { "id": "asthma", "label": "Asthma", "ui_type": "checkbox" }
      ]
    }
  ]
}`}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <DescriptionIcon fontSize="small" />
                <Typography fontWeight={700}>Minimal example OMOP Filters grouped</Typography>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Zoom>
                  <img 
                    src={`${import.meta.env.BASE_URL}assets/images/omop_filters.png`}
                    width={350}
                    alt="Search" 
                  />
                </Zoom>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Alert icon={<TuneIcon />} severity="info">
            <strong>Input types</strong> supported by the UI:
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              <li><code>checkbox</code> → on/off</li>
              <li><code>range</code> → numeric slider (min/max)</li>
              <li><code>text</code> → free text</li>
              <li><code>select</code> → dropdown (currently rendered as Yes/No)</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        3) What the user sees (OMOP filters panel)
      </Typography>
      <List sx={{ color: "text.secondary" }}>
        <ListItem>
          <ListItemText
            primary="Pick a group, then a filter"
            secondary="The first dropdown lists groups; the second lists filters from that group."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Choose the input"
            secondary="For checkbox: just tick it. For range: move the slider. For text/select: enter or pick a value."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Add Filter"
            secondary='Click “Add Filter” to include it in your search. You can add several OMOP filters before pressing "Search".'
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        4) What gets sent to the search (for admins)
      </Typography>
      <Typography color="text.secondary" paragraph>
        Internally, each OMOP selection is normalized and stored in context as{" "}
        <code>{"{ id, uiType, value }"}</code>. {/* ✅ show literal text */}
        {" "}When you press <em>Search</em>, your query builder should append these to the Beacon
        request (exact mapping depends on your backend). Typical shapes:
      </Typography>

      <CodeBlock
        code={`// Examples of normalized OMOP selections stored in context:
  [
    { "id": "glucose",     "uiType": "range",    "value": { "min": 70, "max": 110 } },
    { "id": "diabetes_dx", "uiType": "checkbox", "value": true },
    { "id": "note_text",   "uiType": "text",     "value": "metformin" },
    { "id": "consent_ok",  "uiType": "select",   "value": "Yes" }
  ]

  // Your query builder can translate them into your POST body, e.g.:
  {
    "meta": {
      "apiVersion": "2.0"
    },
    "query": {
      "filters": [
        {
          "id": "SNOMED:62106007",
          "includeDescendantTerms": true
        },
        {
          "id": "Gender:F",
          "includeDescendantTerms": true
      }
      ],
      "includeResultsetResponses": "HIT",
      "pagination": {
        "skip": 0,
        "limit": 10
      },
      "testMode": false,
      "requestedGranularity": "record"
    }
  }
}`}
      />

      <Alert severity="warning" sx={{ mt: 2 }}>
        <strong>Important:</strong> the exact JSON shape expected by your Beacon/OMOP backend
        may differ. Align the query builder with your API (field names, scopes, operators).
      </Alert>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        5) Summary checklist
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary='Set `"omop": true` in public/config/config.json.' />
        </ListItem>
        <ListItem>
          <ListItemText primary="Place omop_filters_grouped.json at public/config/ (served at /config/omop_filters_grouped.json)." />
        </ListItem>
        <ListItem>
          <ListItemText primary='Ensure your query builder merges OMOP selections into the POST body sent to the Beacon API.' />
        </ListItem>
      </List>
    </Box>
  );
}
