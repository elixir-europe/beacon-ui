import { useMemo, useState } from "react";
import { Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from "@mui/material";

function normalizeItem(x) {
  if (x == null) return "";
  if (typeof x === "string" || typeof x === "number") return String(x);
  if (Array.isArray(x)) return x.map(normalizeItem).filter(Boolean).join(", ");
  if (typeof x === "object") return x.label || x.name || x.id || Object.values(x).map(normalizeItem).filter(Boolean).join(", ");
  return String(x);
}

export function BigArrayCell({ items, title = "Items", maxInline = 6 }) {
  const [open, setOpen] = useState(false);
  const labels = useMemo(() => (Array.isArray(items) ? items.map(normalizeItem).filter(Boolean) : []), [items]);
  const inline = labels.slice(0, maxInline);
  const rest = labels.length - inline.length;

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {inline.map((label, i) => (
          <Tooltip key={i} title={label}>
            <Chip
              size="small"
              label={label}
              sx={{
                maxWidth: 180,
                "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
              }}
            />
          </Tooltip>
        ))}
        {rest > 0 && (
          <Button size="small" onClick={() => setOpen(true)} sx={{ textTransform: "none", p: 0, minWidth: "auto" }}>
            +{rest} more
          </Button>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ maxHeight: 420, overflowY: "auto", display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {labels.map((label, i) => (
              <Chip
                key={i}
                size="small"
                label={label}
                sx={{ "& .MuiChip-label": { whiteSpace: "nowrap" } }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(labels, null, 2))}
            sx={{ textTransform: "none" }}
          >
            Copy JSON
          </Button>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
