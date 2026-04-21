# Nuxt Portfolio Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to create your own portfolio with [Nuxt UI](https://ui.nuxt.com).

- [Live demo](https://portfolio-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/getting-started/installation)

<a href="https://portfolio-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/portfolio-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/portfolio-light.png">
    <img alt="Nuxt Portfolio Template" src="https://ui.nuxt.com/assets/templates/nuxt/portfolio-dark.png">
  </picture>
</a>

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t ui/portfolio
```

## Docker Workflow

This repository is configured to run without a local Node.js installation.

Start all services (Nuxt + Postgres):

```bash
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f web
```

Stop services:

```bash
docker compose down
```

## Database Configuration (Docker + Supabase)

The app is configured to support both environments:

- Local development with Docker Postgres using `DATABASE_URL`
- Production on Vercel using Supabase Postgres via `SUPABASE_DB_URL`

Environment variables:

```bash
DATABASE_URL=postgresql://appuser:apppassword@db:5432/appdb
SUPABASE_DB_URL=
DB_SSL=auto
```

Notes:

- If `SUPABASE_DB_URL` is set, it takes priority over `DATABASE_URL`.
- `DB_SSL=auto` enables SSL in production and for Supabase hosts.
- Use this endpoint to verify connectivity from Nuxt server: `/api/health/db`.

## Spotify Integration (Music Page)

The route `/music` now consumes data from the internal endpoint `/api/music/spotify`.

Required environment variables:

```bash
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_ARTIST_ID=
```

Optional environment variables:

```bash
SPOTIFY_PLAYLIST_IDS=37i9dQZF1DXcBWIGoYBM5M,37i9dQZF1DX0XUsuxWHRQd
SPOTIFY_MARKET=US
```

Notes:

- `SPOTIFY_ARTIST_ID` is used to fetch album releases and derive top tracks from catalog data.
- `SPOTIFY_PLAYLIST_IDS` supports a comma-separated list of public playlist IDs.
- The server uses Spotify Client Credentials flow and caches the access token in memory.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=portfolio&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fportfolio&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fportfolio-dark.png&demo-url=https%3A%2F%2Fportfolio-template.nuxt.dev%2F&demo-title=Nuxt%20Portfolio%20Template&demo-description=A%20sleek%20portfolio%20template%20to%20showcase%20your%20work%2C%20skills%20and%20blog%20powered%20by%20Nuxt%20Content.)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.

--Correo en produccion
no-reply@tudominio.com