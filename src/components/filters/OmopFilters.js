import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Slider,
  Typography,
  Button,
  Tooltip,
  Chip
} from "@mui/material";
import { useSelectedEntry } from "../context/SelectedEntryContext";

async function loadDefaultData() {
  const res = await fetch("/config/omop_filters_grouped.json");
  if (!res.ok) throw new Error("No se pudo cargar filters_grouped.json");
  return await res.json();
}

const filterValue = (f) => String(f?.id ?? f?.code ?? f?.label ?? "");

export default function OmopFilters({ data, onChange }) {
  const [json, setJson] = useState(data || null);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [value, setValue] = useState(null);
  const { setOmopFilters } = useSelectedEntry();

  const CFG = globalThis.CONFIG ?? {};
  const primary = CFG.ui?.colors?.primary || "#1976d2";

  const unitFull = /\[(.*?)\]/.exec(selectedFilter?.label || "")?.[1] || "";

  const unitShort = unitFull
    .replace(/Moles/i, "mol")
    .replace(/Units/i, "U")
    .replace(/volume/i, "vol");

  const val = Array.isArray(value) ? value : [0, 0];

  useEffect(() => {
    if (data) return;
    let mounted = true;
    loadDefaultData()
      .then((d) => mounted && setJson(d))
      .catch((e) => mounted && setError(e.message));
    return () => {
      mounted = false;
    };
  }, [data]);

  useEffect(() => {
    if (typeof onChange === "function" && selectedFilter) {
      onChange({ [selectedFilter.id ?? selectedFilter.code]: value });
    }
  }, [value, selectedFilter, onChange]);

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!json) return <Typography>Cargando…</Typography>;

  const groups = json.groups || [];
  const currentGroup = groups.find((g) => g.group_id === selectedGroup);
  const filters = currentGroup?.filters || [];

  const getFilterId = (f) => String(f?.code ?? f?.id ?? f?.label ?? "");

  const upsertFilter = (list, next) => {
    const i = list.findIndex((f) => f.id === next.id);
    if (i === -1) return [...list, next];
    const copy = list.slice();
    copy[i] = next;
    return copy;
  };

  const normalizeValueForContext = (uiType, value) => {
    const t = (uiType || "checkbox").toLowerCase();
    if (t === "checkbox") return true;
    if (t === "range") {
      const [minRaw, maxRaw] = Array.isArray(value) ? value : [null, null];
      const min = Number.isFinite(minRaw) ? Number(minRaw) : undefined;
      const max = Number.isFinite(maxRaw) ? Number(maxRaw) : undefined;
      if (min == null && max == null) return null;
      return { min, max };
    }

    if (value == null || String(value).trim() === "") return null;
    return String(value);
  };

  const hasValidValue = (uiType, value) => {
    const t = (uiType || "checkbox").toLowerCase();
    if (t === "checkbox") return true;
    if (t === "range") {
      const [a, b] = Array.isArray(value) ? value : [null, null];
      return Number.isFinite(a) || Number.isFinite(b);
    }
    return value != null && String(value).trim() !== "";
  };

  const handleAddFilter = () => {
    if (!selectedFilter) return;
    const id = getFilterId(selectedFilter);
    const uiType = (selectedFilter.ui_type || "checkbox").toLowerCase();

    if (!hasValidValue(uiType, value)) return;
    const normalized = normalizeValueForContext(uiType, value);
    if (normalized === null) return;

    setOmopFilters((prev) =>
      upsertFilter(prev, { id, uiType, value: normalized })
    );

    setSelectedFilter(null);
    setValue(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 400 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Group</InputLabel>
        <Select
          value={selectedGroup}
          label="Group"
          onChange={(e) => {
            setSelectedGroup(e.target.value);
            setSelectedFilter(null);
            setValue(null);
          }}
          sx={{
                "& .MuiSelect-select": {
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingLeft: "12px",
                  paddingRight: "32px",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: CONFIG.ui.colors.primary,
                },
              }}
        >
          <MenuItem value="">
            <em>Select a group</em>
          </MenuItem>
          {groups.map((g) => (
            <MenuItem key={g.group_id} value={g.group_id}>
              {g.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filters.length > 0 && (
        <FormControl fullWidth size="small">
          <InputLabel>Filters</InputLabel>
          <Select
            value={selectedFilter ? filterValue(selectedFilter) : ""}
            label="Filter"
            onChange={(e) => {
              const v = e.target.value;
              const f = filters.find((x) => filterValue(x) === v) || null;
              setSelectedFilter(f);
              setValue(null);
            }}
            sx={{
                "& .MuiSelect-select": {
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  paddingLeft: "12px",
                  paddingRight: "32px",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: CONFIG.ui.colors.primary,
                },
              }}
            >
            <MenuItem value="">
              <em>Select a filter</em>
            </MenuItem>
            {filters.map((f) => (
              <MenuItem key={filterValue(f)} value={filterValue(f)}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedFilter && (
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            {selectedFilter.label}
          </Typography>

          {(() => {
            const type = (selectedFilter.ui_type || "checkbox").toLowerCase();

            if (type === "checkbox") {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!value}
                      onChange={(e) => setValue(e.target.checked)}
                      sx={{
                        color: primary,
                        '&.Mui-checked': { color: primary },
                      }}
                    />
                  }
                  label="Activate"
                />
              );
            }

            if (type === "range") {
              return (
                <Box
                  sx={{ paddingTop: '30px' }}>
                  <Slider
                    value={val}
                    onChange={(_, newVal) => setValue(newVal)}
                    valueLabelDisplay="on"
                    valueLabelFormat={(v) => `${v}`}
                    step={1}
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 50, label: "50" },
                      { value: 100, label: "100" },
                    ]}
                    sx={{
                      color: primary,
                      ".MuiSlider-markLabel": {
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      },
                      "& .MuiSlider-valueLabel": {
                        top: "auto",
                        bottom: 5, 
                        fontSize: "0.65rem",
                      },
                    }}
                  />
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="caption">Min: {val[0]}</Typography>
                      <Typography variant="caption">Max: {val[1]}</Typography>
                    </Box>

                    {unitFull && (
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                        <Tooltip title={unitFull} arrow>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={unitShort}
                            sx={{ fontSize: "0.75rem", height: 22 }}
                          />
                        </Tooltip>
                      </Box>
                    )}
                </Box>
              );
            }

            if (type === "text") {
              return (
                <TextField
                  fullWidth
                  label="Valor"
                  value={value || ""}
                  onChange={(e) => setValue(e.target.value)}
                  sx={{
                    '& label.Mui-focused': {
                      color: primary,
                    },
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: primary,
                      },
                    },
                  }}
                />
              );
            }

            if (type === "select") {
              return (
                <FormControl fullWidth>
                  <InputLabel sx={{ color: primary }}>Valor</InputLabel>
                  <Select
                    value={value || ''}
                    onChange={(e) => setValue(e.target.value)}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': { borderColor: primary },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: primary,
                      },
                      '& .MuiSelect-icon': { color: primary },
                    }}
                  >
                    <MenuItem value=""><em>Select…</em></MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              );
            }

            return null;
          })()}
          <Box>
            <Button 
              variant="outlined"
              size="small"
              onClick={handleAddFilter}
              disabled={!selectedFilter || !hasValidValue(selectedFilter.ui_type, value)}
              sx={{
                mt: 2,
                borderRadius: "999px",
                textTransform: "none",
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "14px",
                fontWeight: 700,
                color: CONFIG.ui.colors.darkPrimary,
                borderColor: CONFIG.ui.colors.darkPrimary,
                '&:hover': {
                  backgroundColor: '#f2f2f2',
                },
              }}
            >
              Add Filter
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
