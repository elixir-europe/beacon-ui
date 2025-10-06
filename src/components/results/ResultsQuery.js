import { useState, useMemo } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useSelectedEntry } from "../context/SelectedEntryContext";

export default function ResultsQuery() {
  const { searchJSON } = useSelectedEntry();
  const [open, setOpen] = useState(false);

  const CFG = globalThis.CONFIG ?? {};
  const primary = CFG.ui?.colors?.primary || "#1976d2";

   const bodyText = useMemo(() => {
    if (!searchJSON) return "{}";

    let bodyCandidate = searchJSON.body ?? searchJSON.query ?? searchJSON;

    if (typeof bodyCandidate === "string") {
      try {
        const parsed = JSON.parse(bodyCandidate);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return bodyCandidate;
      }
    }

    try {
      return JSON.stringify(bodyCandidate, null, 2);
    } catch {
      return "{}";
    }
  }, [searchJSON]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bodyText);
    } catch (e) {
      console.error("Cannot copy JSON", e);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: "999px",
          textTransform: "none",
          fontSize: "12px",
          borderColor: primary,
          color: primary,
          maxHeight: "32px",
          "&:hover": { borderColor: primary, backgroundColor: "rgba(0,0,0,0.02)" },
        }}
        startIcon={<span>🧾</span>}
      >
        View Query JSON
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92vw", sm: "85vw", md: "70vw" },
            maxHeight: "80vh",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1px solid ${primary}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Query JSON
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="text"
                onClick={handleCopy}
                sx={{ textTransform: "none", color: primary }}
              >
                Copy
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => setOpen(false)}
                sx={{ textTransform: "none", color: primary }}
              >
                Close
              </Button>
            </Box>
          </Box>

          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              fontSize: "12px",
              lineHeight: 1.5,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              whiteSpace: "pre",
              overflow: "auto",
              flex: 1,
              backgroundColor: "#fafafa",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {bodyText  || "{ }"}
          </Box>
        </Box>
      </Modal>
    </>
  );
}
