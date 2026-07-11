# Clisense — Web Frontend

React + Vite + TypeScript + Tailwind + shadcn-ui product frontend for Clisense.
This is the `web/` package of the Clisense monorepo. For the full project overview,
the Python ML app, and architecture, see the [root README](../README.md).

## Run locally

```bash
cp .env.example .env      # then fill in your Supabase values (never commit .env)
npm install
npm run dev               # http://localhost:8080
```

## Connect to the prediction API

Set `VITE_API_URL` in `.env` to the FastAPI backend (local `http://localhost:8000`
or the deployed API) to enable the in-app climate-risk predictor.
