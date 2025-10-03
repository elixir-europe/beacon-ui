import { Box, Typography, Stack, Chip, Alert, Link as MUILink } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
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

export default function Installation() {
  return (
    <Box id="installation" sx={{ scrollMarginTop: 96 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Chip icon={<LinkIcon />} label="Installation" color="primary" />
        <Chip label="Docker" variant="outlined" />
      </Stack>

      <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
        Beacon-UI · Installation
      </Typography>

      {/* Development first */}
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Development (Docker Compose)
      </Typography>
      <Typography color="text.secondary" paragraph>
        For local development, run Beacon-UI inside a Node container with live reload. The
        service below mounts your source code and exposes port <code>3000</code>. We keep only
        the environment variables that the UI actually uses, skipping unused ones.
      </Typography>

      <CodeBlock
        lang="yaml"
        code={`services:
  web:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "corepack enable && (yarn install --immutable || yarn install --frozen-lockfile) && yarn start"
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      HOST: 0.0.0.0
      CHOKIDAR_USEPOLLING: "true"
      WATCHPACK_POLLING: "true"
      GENERATE_SOURCEMAP: "false"

      # Runtime app config (keep only what you actually use)
      REACT_APP_BEACON_UI_API_BASE_URL: \${BEACON_UI_API_BASE_URL:-https://beacons.bsc.es/beacon-network/v2.0.0}
      REACT_APP_BEACON_UI_PUBLIC_URL: \${BEACON_UI_PUBLIC_URL:-http://localhost:3000}

    volumes:
      - .:/app
      - node_modules:/app/node_modules

volumes:
  node_modules:`}
      />

      <Typography color="text.secondary" paragraph sx={{ mt: 2 }}>
        Start it with:
      </Typography>
      <CodeBlock code={`docker compose up web\n# or\ndocker compose up -d web`} />

      <Alert severity="info" sx={{ mt: 2 }}>
        Once running, open <code>http://localhost:3000</code>. Hot reload will pick up file changes from your host.
      </Alert>

      {/* Configuration via JSON (optional) */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Configuration
      </Typography>
      <Typography color="text.secondary" paragraph>
        Beacon-UI can read configuration from <code>JSON</code> files. If you keep a custom config in
        <code> ./config</code>, mount it into the container:
      </Typography>
      <CodeBlock
        code={`# Example: mount a custom configuration directory
docker run --rm -p 3000:3000 -v $(pwd)/config:/app/config beacon-ui`}
      />
      <Alert severity="warning" sx={{ mt: 2 }}>
        The internal config path may vary by version. Check the repository <strong>README</strong> for the exact location and keys.
      </Alert>

      {/* Production (optional) */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Production image (optional)
      </Typography>
      <Typography color="text.secondary" paragraph>
        To build and run a production Docker image:
      </Typography>
      <CodeBlock code={`docker build -t beacon-ui .\ndocker run --rm -p 3000:3000 beacon-ui`} />

      {/* References */}
      <Alert severity="info" sx={{ mt: 3 }}>
        Official repository:{" "}
        <MUILink href="https://github.com/elixir-europe/beacon-ui" target="_blank" rel="noreferrer">
          elixir-europe/beacon-ui
        </MUILink>
      </Alert>

      {/* Production (Docker + Nginx + runtime JSON config) */}
<Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
  Production (Docker + Nginx + runtime JSON config)
</Typography>
<Typography color="text.secondary" paragraph>
  For production, build a static bundle and serve it with Nginx. No environment variables are required:
  the UI reads its settings from a <code>config.json</code> file loaded at <em>runtime</em>.
</Typography>

<CodeBlock
  lang="yaml"
  code={`# docker-compose.yml
services:
  web:
    build: .
    image: beacon-ui:latest
    ports:
      - "8080:80"
    # Mount runtime config directory (read-only)
    volumes:
      - ./config:/usr/share/nginx/html/config:ro
`}
 />

<Typography color="text.secondary" paragraph sx={{ mt: 2 }}>
  Build and run:
</Typography>
<CodeBlock code={`docker compose build web\ndocker compose up -d web\n# open http://localhost:8080`} />

<Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
  Multi-stage Dockerfile
</Typography>
<CodeBlock
  lang="dockerfile"
  code={`# --- stage 1: build ---
ARG NODE_VERSION=20
FROM node:\${NODE_VERSION}-alpine AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN sh -c "corepack enable && (yarn install --immutable || yarn install --frozen-lockfile)"
COPY . .
ENV NODE_ENV=production
RUN yarn build   # outputs to /app/build

# --- stage 2: runtime (nginx) ---
FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html/config

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
/>

<Typography variant="subtitle1" sx={{ mt: 3 }} gutterBottom>
  Minimal <code>nginx.conf</code> for SPA + runtime config
</Typography>
<CodeBlock
  lang="nginx"
  code={`server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Serve the SPA
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets
  location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    try_files $uri =404;
    expires 7d;
    access_log off;
  }

  # Runtime config: disable caching so changes apply without rebuilds
  location /config/ {
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate" always;
    expires 0;
    try_files $uri =404;
  }
}`}
/>


<Alert severity="info" sx={{ mt: 2 }}>
  The UI should load <code>/config/config.json</code> on startup. Keep this file out of the build
  and mount it at runtime for easy updates without rebuilding the image.
</Alert>

    </Box>

    
  );
}
