import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Divider,
  Alert,
  Link as MUILink,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonIcon from "@mui/icons-material/Person";

function CodeBlock({ code, lang = "ts" }: { code: string; lang?: string }) {
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

export default function ComponentAuthorizationDocs() {
  return (
    <Container maxWidth="lg" id="component-authorization" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<LockIcon />} label="Authentication & Authorization" color="primary" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight:800 }} gutterBottom>
        Sign‑in (OIDC) and permissions — explained for non‑developers
      </Typography>
      <Typography color="text.secondary" paragraph>
        Beacon‑UI can ask users to sign in using an identity provider (IdP) via the OpenID Connect (OIDC) standard. After a
        successful login, the IdP gives the website a short‑lived <em>access token</em>. The UI automatically sends this token when
        calling protected API endpoints (so users can see data they are allowed to see).
      </Typography>

      <Alert severity="info" sx={{ my: 2 }}>
        <strong>Where is the login configuration?</strong> In <code>public/config/config-oidc.json</code> (served at
        <code> /config/config-oidc.json</code>). It contains the IdP URL and the client ID. <em>These are not passwords</em> — they are
        public identifiers so the IdP knows which website is asking for login.
      </Alert>

      <Typography variant="h5" gutterBottom>
        2) How the login flow works (what users see)
      </Typography>
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: (t) => `1px solid ${t.palette.divider}`,
          background: (t) =>
            t.palette.mode === 'dark'
              ? `linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.10))`
              : `linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.05))`,
        }}
      >
        {[
          {
            icon: <LoginIcon fontSize="small" />,
            title: 'User clicks the Login button in the Navbar',
            subtitle: 'The sign‑in starts from the top‑right menu.',
          },
          {
            icon: <OpenInNewIcon fontSize="small" />,
            title: "Redirect to your organization's identity provider (IdP)",
            subtitle: 'Same login page you may use for other apps (single sign‑on).',
          },
          {
            icon: <VpnKeyIcon fontSize="small" />,
            title: 'Return with a short authorization code',
            subtitle: 'The code appears briefly in the URL after login.',
          },
          {
            icon: <VerifiedUserIcon fontSize="small" />,
            title: 'The site exchanges the code for an access token',
            subtitle: 'Happens automatically in the background (no action required).',
          },
          {
            icon: <PersonIcon fontSize="small" />,
            title: "User’s name appears in the Navbar",
            subtitle: 'From now on, protected API calls include the token so the user can see allowed data.',
          },
        ].map((s, idx, arr) => (
          <Box key={idx} sx={{ position: 'relative', pl: 5, pb: idx === arr.length - 1 ? 0 : 3 }}>
            {/* vertical connector */}
            {idx < arr.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: 36,
                  bottom: -8,
                  width: 2,
                  bgcolor: 'divider',
                  opacity: 0.8,
                }}
              />
            )}

            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: (t) => `0 2px 8px ${t.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(2,52,82,0.25)'}`,
                }}
                aria-hidden
              >
                {s.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                  {idx + 1}. {s.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {s.subtitle}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>

      <Typography color="text.secondary" paragraph>
        Under the hood we use <code>react-oidc-context</code>. The Navbar contains the logic to start login, logout, and process the
        response from the IdP. Errors (if any) are shown in a dialog.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Navbar — where the login happens
      </Typography>
      <CodeBlock
        code={`// Start login (user clicks the button)\nauth.signinRedirect({ redirect_uri: window.location.origin });\n\n// On return from the IdP (URL contains ?code=...)\nawait auth.signinRedirectCallback(); // exchanges the code for a token\n\n// Logout\nauth.signoutRedirect({ post_logout_redirect_uri: window.location.origin });`}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        3) Using the token for permissions
      </Typography>
      <Typography color="text.secondary" paragraph>
        When the user is logged in, <code>react-oidc-context</code> provides an <code>access_token</code>. The UI adds it to requests that
        need authorization. If there is no token (user is not logged in), the request is sent without it and the server may return
        fewer results or deny the request, depending on your policies.
      </Typography>

      <CodeBlock
        code={`// Inside a data request (simplified)\nconst token = auth.isAuthenticated && !auth.user?.expired ? auth.user?.access_token : null;\n\nconst requestOptions = {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(query),\n};\n\nif (token) {\n  requestOptions.headers.Authorization = \`Bearer \${token}\`;\n}\n\nconst res = await fetch(\`${'${CONFIG.apiUrl}/${selectedPathSegment}'}\`, requestOptions);`}
      />

      <Typography color="text.secondary" paragraph>
        Typical protected actions include: fetching detailed result records, downloading tables, or accessing endpoints that are not
        public. The exact permissions depend on your backend and your IdP configuration (groups/roles/scopes).
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        4) Setup checklist (admin friendly)
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Ask your IdP admin for: authority URL (oidcUrl), client ID, allowed redirect URLs, and scopes (e.g., openid profile email)." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Put these values in public/config/config-oidc.json." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Ensure your site's public URL (appUrl) is registered as a valid redirect and post-logout URL in the IdP." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Serve the site over HTTPS (required by most IdPs and browsers)." />
        </ListItem>
        <ListItem>
          <ListItemText primary="If you want to force sign‑in for searches, set loginRequired: true in config.json (optional policy)." />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        5) Troubleshooting (plain language)
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Login page loops or shows 'redirect_uri mismatch'"
            secondary="Your site URL is not registered correctly at the IdP. Ask the admin to add it (both login and logout URLs)."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="I get 'invalid_client' or 'unauthorized'"
            secondary="The client ID is wrong or disabled. Confirm the exact value with the IdP admin."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="I can log in, but API calls fail with 401/403"
            secondary="The token is not sent (user not logged), the scopes/roles are missing, or the API blocks your site (CORS)."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Download button does nothing"
            secondary="Some downloads require login. Ensure you are logged in and that your token has access to that dataset."
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Security & privacy notes
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="config-oidc.json contains no secrets (only public identifiers). Never put passwords or private keys there." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Tokens are managed by the library in the browser and expire automatically. Users can sign out from the menu." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Always use HTTPS to protect tokens in transit." />
        </ListItem>
      </List>

      <Divider sx={{ my: 3 }} />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Typography variant="body2" color="text.secondary">Reference:</Typography>
        <MUILink href="https://github.com/elixir-europe/beacon-ui/blob/main/public/config/config-oidc.json" target="_blank" rel="noreferrer">
          Example config-oidc.json (repository)
        </MUILink>
      </Stack>
    </Container>
  );
}
