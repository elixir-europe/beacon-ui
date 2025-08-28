import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Navbar({ title, main, navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const textStyle = {
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "100%",
    letterSpacing: "0%",
    color: "white",
    "@media (max-width: 1080px)": {
      fontSize: "14px",
    },
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: CONFIG.ui.colors.primary,
          color: "white",
          px: 1,
          minHeight: "68px",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            gap: 2,
            px: "9px",
            minHeight: "68px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: "fit-content",
              flexShrink: 0,
              "@media (min-width: 768px)": {
                gap: 2.5,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: {
                  xs: "block",
                },
                "@media (max-width: 385px)": {
                  display: "none",
                },
              }}
            >
              <img
                src={main}
                alt="Logo"
                className="w-logo-w h-logo-h object-contain logo-small"
              />
            </Box>

            <Typography
              className="font-sans"
              component={Link}
              to="/"
              sx={{
                fontWeight: "bold",
                fontFamily: '"Open Sans", sans-serif',
                color: "white",
                cursor: "pointer",
                fontSize: "15px",
                whiteSpace: "nowrap",
                "@media (max-width: 410px)": {
                  fontSize: "14px",
                },
                "@media (min-width: 768px)": {
                  fontSize: "16px",
                },
                "@media (max-width: 930px) and (min-width: 900px)": {
                  fontSize: "15.7px",
                },
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{
                display: { md: "none" },
                flexShrink: 0,
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              className="nav-items-box"
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "flex",
                },
                gap: 2,
                "@media (max-width: 968px) and (min-width: 900px)": {
                  gap: 0,
                },
              }}
            >
              {navItems
                .filter((item) => item.label && item.label.trim() !== "")
                .map((item) =>
                  item.url && item.url.startsWith("http") ? (
                    <Button
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        ...textStyle,
                        textTransform: "none",
                      }}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.url}
                      sx={{
                        ...textStyle,
                        textTransform: "none",
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: "none" } }}
      >
        <List sx={{ width: 240, pt: 3 }}>
          <ListItem
            sx={{
              px: 3,
              py: 1,
              justifyContent: "flex-start",
              textTransform: "none",
              fontFamily: '"Open Sans", sans-serif',
              fontWeight: 700,
              fontSize: "16px",
              color: CONFIG.ui.colors.primary,
            }}
          >
            {title}
          </ListItem>

          {navItems
            .filter((item) => item.label && item.label.trim() !== "")
            .map((item) => (
              <ListItem key={item.label} disablePadding>
                {item.url && item.url.startsWith("http") ? (
                  <Button
                    fullWidth
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      px: 3,
                      py: 1,
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontFamily: '"Open Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: "16px",
                      color: CONFIG.ui.colors.primary,
                    }}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    component={Link}
                    to={item.url}
                    sx={{
                      px: 3,
                      py: 1,
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontFamily: '"Open Sans", sans-serif',
                      fontWeight: 400,
                      fontSize: "16px",
                      color: CONFIG.ui.colors.primary,
                    }}
                  >
                    {item.label}
                  </Button>
                )}
              </ListItem>
            ))}
        </List>
      </Drawer>
    </>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  main: PropTypes.string.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    })
  ),
};
