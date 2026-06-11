# Clisense — Deployment Guide
## ALU Mission Capstone 2026 | H. Ayomide Agbaje

---

## Architecture Overview

```
clisense/
├── app/
│   ├── streamlit_app.py    # Streamlit frontend (4 tabs)
│   └── api.py              # FastAPI backend (/predict, /health, /states)
├── .streamlit/
│   └── config.toml         # Theme configuration
├── requirements.txt        # Python dependencies
├── README.md
├── .gitignore
├── VIDEO_DEMO_SCRIPT.md
└── DEPLOYMENT_GUIDE.md     # This file
```

---

## Option A: Streamlit Cloud (Frontend)

**URL:** https://share.streamlit.io  
**Expected App URL:** https://agbajecity-clisense.streamlit.app

### Steps:
1. Navigate to https://share.streamlit.io
2. Sign in with GitHub (authorize Streamlit Cloud)
3. Click **New app**
4. Set:
   - Repository: `AgbajeCity/clisense`
   - Branch: `main`
   - Main file path: `app/streamlit_app.py`
   - App URL slug: `clisense`
5. Click **Deploy!**
6. Wait 2–3 minutes for build

### Troubleshooting:
- **ModuleNotFoundError**: Edit requirements.txt and re-deploy
- **FileNotFoundError**: The app self-generates model files on first run — this should not occur
- **Port errors**: Streamlit Cloud manages ports automatically

---

## Option B: Railway (FastAPI Backend)

**URL:** https://railway.app  
**Expected App URL:** https://clisense-production.up.railway.app

### Steps:
1. Navigate to https://railway.app
2. Login with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select: `AgbajeCity/clisense`
5. Set environment variable:
   - `PORT` = `8000` (Railway usually sets this automatically)
6. Set Start Command: `uvicorn app.api:app --host 0.0.0.0 --port $PORT`
7. Deploy

### Verify:
- GET / → returns {"message": "Clisense API is running"}
- GET /health → returns status
- POST /predict → accepts JSON body

---

## Option C: Render (FastAPI Fallback)

**URL:** https://render.com

### Steps:
1. Navigate to https://render.com → New Web Service
2. Connect GitHub → Select `AgbajeCity/clisense`
3. Set:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.api:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/AgbajeCity/clisense.git
cd clisense

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Streamlit
streamlit run app/streamlit_app.py

# Run FastAPI (separate terminal)
uvicorn app.api:app --reload --port 8000
```

---

## API Reference

### POST /predict

**Request body:**
```json
{
  "state": "Benue",
  "month": 8,
  "rainfall_mm": 280,
  "temperature_c": 29,
  "humidity_pct": 85
}
```

**Response:**
```json
{
  "prediction": "Flood Risk",
  "confidence": 0.87,
  "recommendation": "Delay planting by 2–3 weeks. Prepare drainage channels."
}
```

### GET /health
Returns API health status and model version.

### GET /states
Returns list of all 36 Nigerian states supported by the model.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (set by platform) | Railway/Render |

No API keys or secrets are required for the base deployment.

---

*Clisense — ALU Mission Capstone 2026 | H. Ayomide Agbaje*
