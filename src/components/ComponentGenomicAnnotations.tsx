import { Box, Container, Typography, Stack, Chip, Divider, Alert, Link as MUILink } from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";

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

export default function ComponentGenomicAnnotations() {
  return (
    <Container maxWidth="lg" id="component-genomic-annotations" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<BiotechIcon />} label="Component: Genomic Annotations" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Genomic Annotations — quick variant shortcuts
      </Typography>
      <Typography color="text.secondary" paragraph>
        The <strong>Genomic Annotations</strong> panel offers curated, click‑to‑add chips for common variant annotations and examples
        (e.g., <em>TP53</em>, HGVS notations, copy‑number events, molecular effects). It complements the Search Box: use it to
        quickly seed a variant‑centric search, then refine with additional filters.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Source of categories */}
      <Typography variant="h5" gutterBottom>
        Where do the categories come from?
      </Typography>
      <Typography color="text.secondary" paragraph>
        Visibility is driven by your runtime config (<code>public/config/config.json</code>) under
        <code> ui.genomicAnnotations.visibleGenomicCategories</code>. Only the categories listed there are shown.
      </Typography>
      <CodeBlock
        code={`{
  "ui": {
    "genomicAnnotations": {
      "visibleGenomicCategories": [
        "SNP Examples",
        "CNV Examples",
        "Protein Examples",
        "Molecular Effect"
      ]
    }
  }
}`}
      />

      <Typography color="text.secondary" paragraph>
        The component provides built‑in example labels for each category. You can adapt these to your deployment if needed.
      </Typography>

      {/* What each category contains */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        What’s inside each category?
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>SNP Examples</strong> — gene symbols or HGVS single‑nucleotide examples (e.g., <code>TP53</code>, <code>7661960T&gt;C</code>).
        </li>
        <li>
          <strong>CNV Examples</strong> — copy‑number style examples (deletions, ranges), e.g., <code>NC_000001.11 : 1234del</code>.
        </li>
        <li>
          <strong>Protein Examples</strong> — protein‑level (HGVS‑p) notations such as <code>TP53 : p.Trp285Cys</code>.
        </li>
        <li>
          <strong>Molecular Effect</strong> — consequence terms (e.g., <em>Missense Variant</em>, <em>Frameshift Variant</em>).
        </li>
      </Box>

      {/* Interactions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        How it works when you click a chip
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          The selected annotation is added to your <strong>active filters</strong> and results are cleared, ready for a fresh search.
        </li>
        <li>
          <strong>Duplicates</strong> are prevented — clicking the same chip twice won’t add it twice; you’ll see a brief warning instead.
        </li>
        <li>
          Chips are purely <em>shortcuts</em>: you can still combine them with other filtering terms, genomic queries, or common filters.
        </li>
      </Box>

      <Alert severity="info" sx={{ my: 2 }}>
        These annotations are most useful when searching <em>Genomic Variants</em>. Depending on your backend, some annotations may
        also refine <em>Individuals</em> or <em>Biosamples</em> when variant‑to‑subject links are available.
      </Alert>

      {/* UI behaviour */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        How it looks & behaves
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          Categories are displayed as collapsible accordions. The first non‑empty category starts expanded.
        </li>
        <li>
          Annotation chips use the <em>genomic</em> visual style for quick recognition; colors follow your brand settings.
        </li>
      </Box>

      {/* Example: conceptual query */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Example — combining an annotation with a demographic filter
      </Typography>
      <Typography color="text.secondary" paragraph>
        Conceptually, after choosing <em>Genomic Variants</em>, adding <em>Missense Variant</em> and then filtering
        <em> Individuals</em> by <em>Female</em> could lead to a query body like:
      </Typography>
      <CodeBlock
        code={`{
  "meta": { "apiVersion": "2.0" },
  "query": {
    "filters": [
      { "id": "Missense Variant" },
      { "id": "female", "scope": "individual" }
    ],
    "includeResultsetResponses": "HIT",
    "pagination": { "skip": 0, "limit": 10 },
    "requestedGranularity": "record",
    "testMode": false
  }
}`}
      />
      <Typography variant="body2" color="text.secondary" paragraph>
        Actual scopes and field IDs can vary by deployment; your UI will choose the appropriate scope when required.
      </Typography>

      {/* Troubleshooting */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Troubleshooting
      </Typography>
      <Box component="ul" sx={{ pl: 3, color: "text.secondary" }}>
        <li>
          <strong>No categories visible:</strong> check <code>ui.genomicAnnotations.visibleGenomicCategories</code> in your config.
        </li>
        <li>
          <strong>Chips not adding filters:</strong> make sure you’ve selected a result type and that searches aren’t blocked by login.
        </li>
        <li>
          <strong>Unexpected results:</strong> confirm that your backend interprets the chosen annotation IDs as expected in your dataset.
        </li>
      </Box>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">References:</Typography>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config.json" target="_blank" rel="noreferrer">
          config.json (ui.genomicAnnotations)
        </MUILink>
      </Stack>
    </Container>
  );
}
