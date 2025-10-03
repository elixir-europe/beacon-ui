import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  Alert,
  Link as MUILink,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import PaletteIcon from "@mui/icons-material/Palette";
import ImageIcon from "@mui/icons-material/Image";

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

function Swatch({ label, value }: { label: string; value?: string }) {
  const v = value || "#CCCCCC";
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        aria-label={`${label} color sample`}
        sx={{
          width: 44,
          height: 28,
          borderRadius: 1,
          bgcolor: v,
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      />
      <Typography sx={{ fontFamily: '"Open Sans", sans-serif' }}>
        <strong>{label}:</strong> <code>{v}</code>
      </Typography>
    </Stack>
  );
}

const EXAMPLE_CFG = {
  ui: {
    title: "ELIXIR Beacon Network Browser",
    colors: {
      primary: "#023452",
      darkPrimary: "#023452",
      secondary: "#f47d20",
      tertiary: "#bebf32",
    },
    logos: {
      main: "../assets/logos/elixir.png",
      mainSecondary: "../assets/logos/elixir.png",
      founders: [
        "../assets/logos/founder1.svg",
        "../assets/logos/founder2.svg",
        "../assets/logos/founder3.svg",
      ],
    },
  },
};

export default function ComponentBranding() {
  const runtimeCFG: any = (globalThis as any).CONFIG;
  const hasRuntime = Boolean(runtimeCFG?.ui);
  const CFG = hasRuntime ? runtimeCFG : EXAMPLE_CFG;

  const UI = CFG.ui ?? {};
  const colors = UI.colors ?? {};
  const logos = UI.logos ?? {};

  return (
    <Box id="branding" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<BrushIcon />} label="Branding" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Branding — where it comes from and how to change it
      </Typography>
      <Typography color="text.secondary" paragraph>
        Branding (site title, colors, logos) is defined in{" "}
        <code>public/config/config.json</code> under the <code>ui</code>{" "}
        section. Changing that file updates the look &amp; feel without code
        changes.
      </Typography>

      <Alert severity={hasRuntime ? "success" : "warning"} sx={{ mb: 2 }}>
        {hasRuntime ? (
          <>
            Showing <strong>live values</strong> from <code>/config/config.json</code>.
          </>
        ) : (
          <>
            <strong>No runtime config detected.</strong> Showing example values
            based on your JSON. In production, this page reads{" "}
            <code>/config/config.json</code>.
          </>
        )}
      </Alert>

      <CodeBlock
        code={`{
  "ui": {
    "title": "ELIXIR Beacon Network Browser",
    "colors": {
      "primary": "#023452",
      "darkPrimary": "#023452",
      "secondary": "#f47d20",
      "tertiary": "#bebf32"
    },
    "logos": {
      "main": "/assets/logos/elixir.png",
      "mainSecondary": "assets/logos/maingrey.svg",
      "founders": [
        "/assets/logos/founder1.svg",
        "/assets/logos/founder2.svg",
        "/assets/logos/founder3.svg"
      ]
    }
  }
}`}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        1) Site title (<code>ui.title</code>)
      </Typography>
      <Typography color="text.secondary" paragraph>
        Displayed in the top bar and the browser tab.
      </Typography>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography>
            <strong>Current value:</strong>{" "}
            <em>{UI.title || "— not set —"}</em>
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        2) Colors (<code>ui.colors</code>)
      </Typography>
      <Typography color="text.secondary" paragraph>
        Used for the navbar, primary buttons, table headers, and highlights.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <PaletteIcon fontSize="small" />
                <Typography sx={{ fontWeight: 700 }}>Preview</Typography>
              </Stack>
              <Stack spacing={1.25}>
                <Swatch label="primary" value={colors.primary} />
                <Swatch label="darkPrimary" value={colors.darkPrimary} />
                <Swatch label="secondary" value={colors.secondary} />
                <Swatch label="tertiary" value={colors.tertiary} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Alert severity="info">
            Update these values in <code>config.json</code> to change the theme
            without code changes.
          </Alert>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        3) Logos (<code>ui.logos</code>)
      </Typography>
      <Typography color="text.secondary" paragraph>
        Store files in <code>public/assets/logos/</code>. Prefer SVG for crisp
        results. Recommended height ~40–60px in the top bar.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <ImageIcon fontSize="small" />
                <Typography sx={{ fontWeight: 700 }}>Preview</Typography>
              </Stack>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Main logo</strong> (<code>ui.logos.main</code>)
                  </Typography>
                  {logos.main ? (
                    <Box
                      component="img"
                      src={logos.main}
                      alt="Main logo"
                      sx={{ height: 48, objectFit: "contain" }}
                    />
                  ) : (
                    <Typography color="text.secondary">— not set —</Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Secondary logo</strong>{" "}
                    (<code>ui.logos.mainSecondary</code>)
                  </Typography>
                  {logos.mainSecondary ? (
                    <Box
                      component="img"
                      src={logos.mainSecondary}
                      alt="Secondary logo"
                      sx={{ height: 48, objectFit: "contain" }}
                    />
                  ) : (
                    <Typography color="text.secondary">— not set —</Typography>
                  )}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Founders / partners</strong>{" "}
                    (<code>ui.logos.founders[]</code>)
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
                    {(logos.founders || []).map((src: string) => (
                      <Box key={src} component="img" src={src} alt="Founder logo" sx={{ height: 36, objectFit: "contain" }} />
                    ))}
                    {(!logos.founders || logos.founders.length === 0) && (
                      <Typography color="text.secondary">— empty —</Typography>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Example snippet:
          </Typography>
          <CodeBlock
            code={`{
  "ui": {
    "logos": {
      "main": "/assets/logos/elixir.png",
      "mainSecondary": "assets/logos/maingrey.svg",
      "founders": [
        "/assets/logos/founder1.svg",
        "/assets/logos/founder2.svg",
        "/assets/logos/founder3.svg"
      ]
    }
  }
}`}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        What isn't “branding”
      </Typography>
      <Typography color="text.secondary" paragraph>
        Fields like <code>beaconType</code>, <code>apiUrl*</code>,{" "}
        <code>assemblyId</code>, or <code>entryTypesOrder</code> affect
        data/behavior, not the look &amp; feel.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ flexWrap: "wrap", rowGap: 1 }}
      >
        <Typography variant="body2" color="text.secondary">
          Reference:
        </Typography>
        <MUILink
          href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config.json"
          target="_blank"
          rel="noreferrer"
        >
          Example config.json (repository)
        </MUILink>
      </Stack>
    </Box>
  );
}
