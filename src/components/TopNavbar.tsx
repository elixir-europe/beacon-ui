import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type NavItem = { label: string; to: string };

export default function TopNavbar({
  logoUrl,
  navItems,
  mode,
  onToggleMode,
  githubUrl,
}: {
  logoUrl?: string;
  navItems: NavItem[];
  mode: "light" | "dark";
  onToggleMode: () => void;
  githubUrl?: string;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: (t) => `1px solid ${alpha(t.palette.divider, 0.6)}`,
        backgroundImage: "none",
        backdropFilter: "saturate(1.2) blur(8px)",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            mr: 1.5,
            gap: 1,
          }}
        >
          {logoUrl && (
            <Box
              component="img"
              src={logoUrl}
              alt="Logo"
              sx={{ height: 28, width: "auto" }}
            />
          )}
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
            ELIXIR Beacon <Box component="span" sx={{ color: "primary.main" }}>UI</Box> Docs
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={RouterLink}
              to={item.to}
              color="inherit"
              disableRipple
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {githubUrl && (
          <Tooltip title="GitHub">
            <IconButton
              component="a"
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
          <IconButton onClick={onToggleMode} color="inherit" size="small">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <IconButton
          color="inherit"
          sx={{ display: { xs: "inline-flex", md: "none" } }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={() => setAnchorEl(null)}
          keepMounted
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.to}
              component={RouterLink}
              to={item.to}
              onClick={() => setAnchorEl(null)}
              sx={{ fontWeight: 500 }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
