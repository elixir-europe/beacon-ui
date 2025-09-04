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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function Navbar({ title, main, navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();
  const isLogged = auth.isAuthenticated && !auth.user?.expired;

  const cfg = globalThis.CONFIG ?? {};
  const primary = cfg.ui?.colors?.primary || "#1976d2";

  const filteredItems = navItems.filter(i => i?.label?.trim());
  const hasItems = filteredItems.length > 0;

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

  const handleLogout = async() => {
    try {
      await auth.signoutRedirect({
        post_logout_redirect_uri: window.location.origin + "/login"
      });
    } catch (e) {
      console.error("signoutRedirect failed", e);
      await auth.removeUser();
      window.location.assign(window.location.origin + "/login");
    }
  }

   const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}
        sx={{ backgroundColor: primary, color: "white", px: 1, minHeight: "68px" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2, px: "9px", minHeight: "68px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: "fit-content", flexShrink: 0,
                     "@media (min-width: 768px)": { gap: 2.5 }}}>
            <Box
              component={Link}
              to="/"
              sx={{ display: { xs: "block" }, "@media (max-width: 385px)": { display: "none" } }}
            >
              {main ? (
                <img
                  src={main}
                  alt="Logo"
                  className="w-logo-w h-logo-h object-contain logo-small"
                />
              ) : null}
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
                "@media (max-width: 410px)": { fontSize: "14px" },
                "@media (min-width: 768px)": { fontSize: "16px" },
                "@media (max-width: 930px) and (min-width: 900px)": { fontSize: "15.7px" },
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {hasItems && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ display: { md: "none" }, flexShrink: 0 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              className="nav-items-box"
              sx={{
                display: { xs: "none", sm: "none", md: "flex" },
                gap: 2,
                "@media (max-width: 968px) and (min-width: 900px)": { gap: 0 },
              }}
            >
              {filteredItems.map(item =>
                item.url?.startsWith("http") ? (
                  <Button
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ ...textStyle, textTransform: "none" }}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.url}
                    sx={{ ...textStyle, textTransform: "none" }}
                  >
                    {item.label}
                  </Button>
                )
              )}

              {isLogged ? (
                <Button onClick={handleLogout} sx={{ ...textStyle, textTransform: "none" }}>
                  Logout
                </Button>
              ) : (
                <Button onClick={handleLogin} sx={{ ...textStyle, textTransform: "none" }}>
                  Login
                </Button>
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
              px: 3, py: 1, justifyContent: "flex-start", textTransform: "none",
              fontFamily: '"Open Sans", sans-serif', fontWeight: 700, fontSize: "16px",
              color: primary,
            }}
          >
            {title}
          </ListItem>

          {filteredItems.map(item => (
            <ListItem key={item.label} disablePadding>
              {item.url?.startsWith("http") ? (
                <Button
                  fullWidth
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    px: 3, py: 1, justifyContent: "flex-start", textTransform: "none",
                    fontFamily: '"Open Sans", sans-serif', fontWeight: 400, fontSize: "16px",
                    color: primary,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  fullWidth
                  component={Link}
                  to={item.url}
                  sx={{
                    px: 3, py: 1, justifyContent: "flex-start", textTransform: "none",
                    fontFamily: '"Open Sans", sans-serif', fontWeight: 400, fontSize: "16px",
                    color: primary,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Button>
              )}
            </ListItem>
          ))}

          <ListItem disablePadding>
            {isLogged ? (
              <Button
                fullWidth
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                sx={{
                  px: 3, py: 1, justifyContent: "flex-start", textTransform: "none",
                  fontFamily: '"Open Sans", sans-serif', fontWeight: 400, fontSize: "16px",
                  color: primary,
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                fullWidth
                onClick={() => { setMobileOpen(false); handleLogin(); }}
                sx={{
                  px: 3, py: 1, justifyContent: "flex-start", textTransform: "none",
                  fontFamily: '"Open Sans", sans-serif', fontWeight: 400, fontSize: "16px",
                  color: primary,
                }}
              >
                Login
              </Button>
            )}
          </ListItem>
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
