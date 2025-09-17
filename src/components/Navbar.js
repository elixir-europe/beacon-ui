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
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Navbar({ title, main, navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const navigate = useNavigate();
  const auth = useAuth();
  const isLogged = auth.isAuthenticated && !auth.user?.expired;

  const userName = auth?.isAuthenticated ? auth.user?.profile?.given_name ?? "" : "";


  const cfg = globalThis.CONFIG ?? {};
  const primary = cfg.ui?.colors?.primary || "#1976d2";

  const filteredItems = navItems.filter(i => i?.label?.trim());
  const hasItems = filteredItems.length > 0;

  console.log(auth.user)

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
    console.log("Login Out")
    try {
      await auth.signoutRedirect({
        post_logout_redirect_uri: window.location.origin
      });
    } catch (e) {
      console.error("signoutRedirect failed", e);
      await auth.removeUser();
      window.location.assign(window.location.origin);
    }
  }

  const handleLogin = () => {
    navigate("/login");
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}
        sx={{ backgroundColor: primary, color: "white", px: 1, minHeight: "68px" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2, px: "9px", minHeight: "68px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: "fit-content", flexShrink: 0,"@media (min-width: 768px)": { gap: 2.5 }}}>
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
                <>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0, color: "white", fontSize: "16px" }}
                    aria-controls={anchorElUser ? "user-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorElUser ? "true" : undefined}
                  >
                    <AccountCircleIcon />
                    <Box
                      sx={{
                        paddingLeft: '5px'
                      }}>
                      { userName }
                    </Box>
                    <KeyboardArrowDownIcon />
                  </IconButton>
                  <Menu
                    id="user-menu"
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    keepMounted
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                          mt: 1.5,
                          '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem
                      sx={{ fontFamily: '"Open Sans", sans-serif', fontSize: 14 }}>
                      <Link to="/profile">Profile</Link>
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ fontFamily: '"Open Sans", sans-serif', fontSize: 14 }}
                    >
                      Log Out
                    </MenuItem>
                  </Menu>
                </>
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
