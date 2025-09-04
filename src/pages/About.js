/* global CONFIG */
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Link,
  Alert,
  Skeleton,
  Divider
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

export default function About() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const UI = (window.CONFIG?.ui) || {};
  const primary = UI.colors?.primary || "#3176B1";
  const dark = UI.colors?.darkPrimary || "#173D5D";

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${window.CONFIG.apiUrl}/info`, {
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const meta = data?.meta || {};
  const resp = useMemo(() => data?.response || {}, [data]);

  const title = resp.name || UI.title || "About";
  const description =
    resp.description ||
    "Service information and contacts for this Beacon Network instance.";

  const org = resp.organization || {};
  const website = resp.welcomeUrl || resp.homepage || resp.alternativeUrl || null;

  const chips = [
    resp.environment && `env: ${ resp.environment }`,
    (resp.version || meta.version) && `version: ${ resp.version || meta.version }`,
    (resp.apiVersion || meta.apiVersion) && `api: ${ resp.apiVersion || meta.apiVersion }`,
    meta.beaconId && `beaconId: ${ meta.beaconId }`,
    resp.id && `id: ${ resp.id }`,
  ].filter(Boolean);

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Skeleton variant="text" width={ 260 } height={ 40 } />
        <Skeleton variant="rounded" height={ 120 } sx={{ mt: 2 }} />
        <Skeleton variant="rounded" height={ 220 } sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "grid", gap: 3 }}>
      <Box 
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: dark }}>
          {title}
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography sx={{ mb: 1.5, color: "#333" }}>{ description }</Typography>
          {chips.length > 0 && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {chips.map((c, i) => (
                <Chip key={ i } label={ c } size="small" />
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
          <CardContent>
            <Typography sx={{ fontWeight: 700, color: dark, mb: 1 }}>
              Service
            </Typography>
            <Fact label="Service ID" value={ resp.id || "—" } />
            <Fact label="Beacon ID" value={ meta.beaconId || "—" } />
            <Fact label="API version" value={ resp.apiVersion || meta.apiVersion || "—" } />
            <Fact label="Service version" value={ resp.version || "—" } />
            <Fact label="Environment" value={ resp.environment || "—" } />
            {resp.createDateTime && (
              <Fact label="Created" value={ resp.createDateTime } />
            )}
            {resp.updateDateTime && (
              <Fact label="Updated" value={ resp.updateDateTime } />
            )}
            {website && (
              <Fact
                label="Website"
                value={
                  <Link href={website} target="_blank" rel="noreferrer" sx={{ color: primary }}>
                    {website} <LaunchIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2, height: "100%" }}>
          <CardContent>
            <Typography sx={{ fontWeight: 700, color: dark, mb: 1 }}>
              Organization
            </Typography>
            <Fact label="Name" value={ org.name || "—" } />
            <Fact label="Description" value={org.description || "—"} />
            { org.address && <Fact label="Address" value={ org.address } />}
            { org.contactUrl && (
              <Fact
                label="Contact"
                value={
                  <Link href={ org.contactUrl } target="_blank" rel="noreferrer" 
                    sx={{ color: primary }}>
                    { org.contactUrl }
                  </Link>
                }
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function Fact({ label, value }) {
  return (
    <Box sx={{ mb: 1.2 }}>
      <Typography sx={{ fontSize: 12, color: "#666" }}>{label}</Typography>
      <Typography sx={{ fontWeight: 600, wordBreak: "break-word" }}>
        {value ?? "—"}
      </Typography>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
}
