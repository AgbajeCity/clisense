# Clisense — Deployment Guide

ALU Mission Capstone 2026 | H. Ayomide Agbaje

## Architecture Overview

```
clisense/
  app/
    streamlit_app.py       (Streamlit frontend, 4 tabs)
    api.py                 (FastAPI backend: /predict, /health, /states)
  .streamlit/
    config.toml            (Theme configuration)
  requirements.txt         (Python dependencies)
  README.md
  .gitignore
  VIDEO_DEMO_SCRIPT.md
  DEPLOYMENT_GUIDE.md      (This file)
```

## Option A: Streamlit Cloud (Frontend)

URL: https://share.streamlit.io
Live App: https://agbajecity-clisense.streamlit.app

Steps:
1. Navigate to https://share.streamlit.io
2. Sign in with GitHub (authorize Streamlit Cloud)
3. Click **New app**
4. Set Repository to `AgbajeCity/clisense`, Branch to `main`, Main file path to `app/streamlit_app.py`, App URL slug to `clisense`
5. Click **Deploy!**
6. Wait 2-3 minutes for the build

Troubleshooting:
- `ModuleNotFoundError`: edit `requirements.txt` and re-deploy.
- Slow or hanging first prediction: this is expected the very first time a fresh instance wakes up (cold start trains the model in-memory, ~15-30s). If it takes several minutes, confirm the deployed `app/model_core.py` includes the `run_cv=False` fast path used by `load_or_train()` — see `BUGFIX_REPORT.md`.
- Model-related errors on startup: models are **not** committed as `.pkl` files by design — `model_core.load_or_train()` trains them automatically on first run (see `models/README.md`). There is nothing to "confirm is committed"; if training itself fails, check the Streamlit Cloud logs for the actual traceback.
- Port errors: Streamlit Cloud manages ports automatically.

## Option B: Railway (FastAPI Backend)

URL: https://railway.app
Live API: https://clisense-production.up.railway.app

Steps:
1. Navigate to https://railway.app
2. Login with GitHub
3. Click **New Project**, then **Deploy from GitHub repo**
4. Select `AgbajeCity/clisense`
5. Set Start Command to: `uvicorn app.api:app --host 0.0.0.0 --port $PORT`
   (the `$PORT` variable is supplied automatically by Railway; do not hardcode a port)
6. Deploy

Verify:
- `GET /` returns `{"name": "Clisense API", "version": "1.0.0", "docs": "/docs"}`
- `GET /health` returns `{"status": "healthy", "model_loaded": true}`
- `GET /states` returns the 5 supported states
- `POST /predict` accepts a JSON body and returns a prediction

## Option C: Render (FastAPI Fallback)

URL: https://render.com

Steps:
1. Navigate to https://render.com, then **New Web Service**
2. Connect GitHub, then select `AgbajeCity/clisense`
3. Set Environment to Python 3, Build Command to `pip install -r requirements.txt`, Start Command to `uvicorn app.api:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**

## Local Development

```bash
git clone https://github.com/AgbajeCity/clisense.git
cd clisense
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
streamlit run app/streamlit_app.py
uvicorn app.api:app --reload --port 8000
```

On Windows, activate the virtual environment with `venv\Scripts\activate` instead.

## API Reference

### POST /predict

Request body:
```json
{
  "state": "Benue",
  "month": 8,
  "rainfall_mm": 48.0,
  "temp_c": 27.0,
  "humidity_pct": 88,
  "rain_7d": 180.0,
  "rain_30d": 620.0
}
```

Response:
```json
{
  "state": "Benue",
  "month": 8,
  "prediction": "Flood Risk",
  "confidence": 0.92,
  "probabilities": {"Normal": 0.01, "Drought Risk": 0.07, "Flood Risk": 0.92},
  "recommendation": "High flood risk. Avoid low-lying farmland."
}
```

### GET /health
Returns status healthy and whether the model loaded.

### GET /states
Returns the 5 Nigerian agro-ecological states currently supported: Kano, Kaduna, Benue, Niger, and Plateau.

## Environment Variables

`PORT` - server port, set automatically by Railway or Render. No API keys or secrets are required for the base deployment.

---
Clisense — ALU Mission Capstone 2026 | H. Ayomide Agbaje
