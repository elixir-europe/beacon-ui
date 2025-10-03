import React from "react";
import { Box, Container, Typography, Stack, Chip, Divider, Alert, Link as MUILink } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

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

export default function ComponentCommonFilters() {
  return (
    <Container maxWidth="lg" id="component-common-filters" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<FilterAltIcon />} label="Component: Common Filters" color="primary" />
      </Stack>

      <Typography variant="h3" fontWeight={800} gutterBottom>
        Common Filters — quick, curated filters
      </Typography>
      <Typography color="text.secondary" paragraph>
        <strong>Common Filters</strong> are quick‑access, human‑friendly filters grouped by topic (e.g., <em>Demographics</em>,
        <em> Cancer</em>, <em>COVID</em>). They are defined by your configuration and appear as clickable labels. Use them to
        start a search quickly — you can still add more precise filters using the Search Box.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Where options come from */}
      <Typography variant="h5" gutterBottom>
        Where do these options come from?
      </Typography>
      <Typography color="text.secondary" paragraph>
        Everything is driven by your runtime config <code>public/config/config.json</code> under <code>ui.commonFilters</code>:
      </Typography>
      <CodeBlock
        code={`{
  "ui": {
    "commonFilters": {
      "filterCategories": ["Demographics", "Cancer", "COVID"],
      "filterLabels": {
        "Demographics": [
          { "key": "female", "id": "NCIT:C16576", "label": "Female", "type": "ontology" },
          { "key": "male",   "id": "NCIT:C20197", "label": "Male",   "type": "ontology" },
          { "key": "age_of_onset", "id": "age_of_onset", "label": "Age Of Onset", "type": "alphanumeric" }
        ],
        "Cancer": [
          { "key": "Breast Cancer", "id": "NCIT:C4872", "label": "Breast Cancer", "type": "ontology", "scopes": ["individual", "biosample", "cohort"] }
        ],
        "COVID": [
          { "key": "COVID-19", "id": "NCIT:C171222", "label": "COVID-19", "type": "ontology" }
        ]
      }
    }
  }
}`}
      />
      <Typography color="text.secondary" paragraph>
        <strong>filterCategories</strong> defines the accordion sections. <strong>filterLabels</strong> is the list of labels inside each
        section. Labels can be <em>ontology</em> terms (e.g., NCIT IDs) or <em>alphanumeric</em> fields (e.g., <em>age_of_onset</em>),
        and may optionally restrict the <em>scopes</em> they apply to.
      </Typography>

      {/* Relevance to the current result type */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        When do labels show up?
      </Typography>
      <Typography color="text.secondary" paragraph>
        Common Filters only show labels that make sense for the <strong>current result type</strong> (e.g., <em>Individuals</em>,
        <em> Biosamples</em>). The component checks each label with a helper that decides its applicable <em>scope</em> for the
        current context.
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          If a label’s scope matches the selected result type, it’s shown. If a label has no scopes, it’s considered general
          and also shown.
        </li>
        <li>
          Placeholder or empty labels (e.g., <code>label6</code>) are filtered out automatically.
        </li>
        <li>
          The first section that contains valid labels starts expanded by default to help you discover useful filters quickly.
        </li>
      </Box>

      {/* How selection works */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        What happens when I click a label?
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>Ontology term</strong> (e.g., <em>Female</em>, <em>Breast Cancer</em>): it is immediately added to your active filters for
          the right scope.
        </li>
        <li>
          <strong>Alphanumeric field</strong> (e.g., <em>Age Of Onset</em>): the app asks you to provide a value (e.g., <code>&gt; 40</code>,
          <code>= 1970</code>) before adding the filter.
        </li>
        <li>
          <strong>Duplicates are prevented</strong>: if you try to add the same label twice for the same scope, a brief message warns you and
          the filter isn’t duplicated.
        </li>
      </Box>
      <Alert severity="info" sx={{ my: 2 }}>
        Adding a common filter clears previous results so you can run a fresh search with your new criteria.
      </Alert>

      {/* UI behavior */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        How it looks & behaves
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          Filters are displayed as <em>chips</em>. Click to add them. You’ll see your active filters summarized above the results
          table, where you can remove them if needed.
        </li>
        <li>
          Sections are collapsible. The arrow rotates to indicate open/closed state. Styles follow your brand colors.
        </li>
      </Box>

      {/* Practical tips */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Tips for scientists & data stewards
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          Start with 1–2 common filters (e.g., <em>Female</em> + a disease term). Then refine with the Search Box if needed.
        </li>
        <li>
          If a topic shows no labels for a given result type, try switching the result type (e.g., from <em>Biosamples</em> to
          <em> Individuals</em>) — some filters are specific to a data level.
        </li>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">References:</Typography>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config.json" target="_blank" rel="noreferrer">
          config.json (ui.commonFilters)
        </MUILink>
      </Stack>
    </Container>
  );
}
