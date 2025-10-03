import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConstructionIcon from "@mui/icons-material/Construction";

type ComponentCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  status: "Stable" | "Beta" | "Planned";
  source?: string;
};

const REGISTRY: readonly ComponentCard[] = [
  {
    id: "navbar",
    title: "Navbar",
    description:
      "Top navigation built from runtime config via useNavItems(CFG).",
    href: "/components/navbar",
    status: "Stable",
    source:
      "https://github.com/elixir-europe/beacon-ui/blob/main/src/nav/useNavItems.js",
  },
  {
    id: "search-box",
    title: "Search Box",
    description:
      "1) Choose the result type for your search · 2) Enter query/filters · 3) Run the search.",
    href: "/components/search-box",
    status: "Stable",
  },
  {
    id: "results-table",
    title: "Results Table",
    description:
      "Tabular results with pagination, sorting, and column mapping.",
    href: "/components/results-table",
    status: "Stable",
  },
  {
    id: "common-filters",
    title: "Common Filters",
    description: "Reusable filter controls shared across result types.",
    href: "/components/common-filters",
    status: "Stable",
  },
  {
    id: "genomic-annotations",
    title: "Genomic Annotations",
    description: "Optional annotation panel for variant-centric results.",
    href: "/components/genomic-annotations",
    status: "Stable",
  },
  {
    id: "network-members",
    title: "Beacon Network Members (BN only)",
    description:
      "Directory of member beacons — visible only on Beacon Network deployments.",
    href: "/components/network-members",
    status: "Stable",
  },
] as const;

export default function ComponentsPage() {
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return REGISTRY;
    return REGISTRY.filter((c) =>
      [c.title, c.description, c.status].some((v) =>
        v.toLowerCase().includes(query)
      )
    );
  }, [q]);

  return (
    <Container maxWidth="lg" id="components-index" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
        <Chip icon={<WidgetsIcon />} label="Components" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Components
      </Typography>
      <Typography color="text.secondary" paragraph>
        Overview of Beacon-UI components. Each card links to a focused page. Use
        the search box to filter.
      </Typography>

      <Box sx={{ my: 2 }}>
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search components..."
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((c) => (
          <Grid size={{ xs: 12, sm: 6, md: 12 }}  key={c.id}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 2,
                borderColor: (t) => alpha(t.palette.divider, 0.6),
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", mb: 0.5 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {c.title}
                  </Typography>
                  <Chip
                    size="small"
                    color={c.status === "Stable" ? "success" : "default"}
                    icon={
                      c.status === "Stable" ? (
                        <CheckCircleIcon />
                      ) : (
                        <ConstructionIcon />
                      )
                    }
                    label={c.status}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {c.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Button size="small" variant="contained" component={RouterLink} to={c.href}>
                  Open docs
                </Button>
                {c.source && (
                  <Button size="small" href={c.source}>
                    Source
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
