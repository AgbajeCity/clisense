# Clisense — ML-Powered Predictive Climate Intelligence

**Track**: Machine Learning | **ALU Mission Capstone 2026**  
**Student**: H. Ayomide Agbaje | **Supervisor**: Ndinelao Iitumba  
**Program**: ALU BSc Software Engineering, Cohort 14

---

## Overview

Clisense is an AI-powered early warning system designed to help smallholder farmers in rural Nigeria make informed agricultural decisions based on real-time climate threat predictions.

The system uses an XGBoost classifier trained on 18,530 daily climate records across 5 Nigerian agricultural states to predict three threat categories:
- **Normal** — Safe conditions for standard agricultural practices
- **Drought Risk** — Water scarcity requiring conservation and drought-tolerant crops
- **Flood Risk** — Excessive rainfall requiring protective action and field drainage

## Live Demo

- **Streamlit Dashboard**: https://agbajecity-clisense.streamlit.app
- **FastAPI Backend**: https://clisense-production.up.railway.app
- **API Docs (Swagger)**: https://clisense-production.up.railway.app/docs
- **GitHub Repository**: https://github.com/AgbajeCity/clisense

## Model Performance

| Metric | Score |
|--------|-------|
| Overall Accuracy | 99.84% |
| Weighted F1-Score | 0.9984 |
| Weighted Recall | 0.9984 |
| 5-Fold CV Mean F1 | 0.9984 (Std < 0.003) |

## Project Structure

```
clisense/
├── README.md
├── requirements.txt
├── .gitignore
├── .streamlit/
│   └── config.toml
├── app/
│   ├── streamlit_app.py     # Streamlit dashboard
│   └── api.py               # FastAPI backend
├── data/
│   ├── nigeria_climate_2015_2024.csv
│   └── generate_nigeria_climate_data.py
├── models/
│   ├── clisense_xgb_model.pkl
│   ├── clisense_scaler.pkl
│   └── ...
├── assets/
│   ├── fig1_rainfall_distribution.png
│   └── ... (9 visualization figures)
└── notebooks/
    └── Clisense_ML_Notebook_executed.ipynb
```

## Technology Stack

- **ML**: XGBoost 2.0, scikit-learn, Python 3.10
- **Dashboard**: Streamlit 1.28+
- **API**: FastAPI, Uvicorn, Pydantic
- **Data**: Pandas, NumPy, Matplotlib, Seaborn

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run Streamlit dashboard
streamlit run app/streamlit_app.py

# Run FastAPI backend
uvicorn app.api:app --host 0.0.0.0 --port 8000
```

## API Usage

```bash
curl -X POST "https://clisense-production.up.railway.app/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "state": "Benue",
    "month": 8,
    "rainfall_mm": 48,
    "temp_c": 27,
    "humidity_pct": 88,
    "rain_7d": 180,
    "rain_30d": 620
  }'
```

## Coverage Area

| State | Ecological Zone |
|-------|----------------|
| Kano | Sudan Savanna |
| Kaduna | Northern Guinea Savanna |
| Benue | Southern Guinea Savanna |
| Niger | Northern Guinea Savanna |
| Plateau | Jos Plateau Highland |

---

*ALU Mission Capstone 2026 — Machine Learning Track*
