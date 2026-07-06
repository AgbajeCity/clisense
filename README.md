# Clisense — ML-Powered Predictive Climate Intelligence

**Track**: Machine Learning | **ALU Mission Capstone 2026**
**Student**: H. Ayomide Agbaje | **Supervisor**: Ndinelao Iitumba
**Program**: ALU BSc Software Engineering, Cohort 14

---

## Overview

Clisense is an AI-powered early warning system that helps smallholder farmers in rural Nigeria make informed agricultural decisions from real-time climate threat predictions. Given a state, month, and current weather readings, it classifies the near-term climate risk into one of three categories so farmers and extension workers can act before damage occurs:

- **Normal** — Safe conditions for standard agricultural practices
- **Drought Risk** — Water scarcity requiring conservation and drought-tolerant crops
- **Flood Risk** — Excessive rainfall requiring protective action and field drainage

## Live Demo

- **Streamlit Dashboard**: https://agbajecity-clisense.streamlit.app
- **FastAPI Backend**: https://clisense-production.up.railway.app
- **API Docs (Swagger)**: https://clisense-production.up.railway.app/docs
- **API Health Check**: https://clisense-production.up.railway.app/health
- **GitHub Repository**: https://github.com/AgbajeCity/clisense
- **Video Demo (5 min)**: _link to be added after recording — see `VIDEO_DEMO_SCRIPT.md` for the walkthrough script_

## How It Works / Architecture

Both the Streamlit dashboard (`app/streamlit_app.py`) and the FastAPI backend (`app/api.py`) import a single shared module, `app/model_core.py`, which contains all data generation, training, and prediction logic. There is exactly one training code path, so the two deployed services can never drift apart or use incompatible feature schemas — this was the direct fix for a real bug documented in `BUGFIX_REPORT.md`.

On startup, `model_core.load_or_train()` generates the synthetic Nigerian climate dataset (18,530 daily records across 5 agricultural states — Kano, Kebbi, Benue, Cross River, and Adamawa — spanning realistic wet/dry season rainfall, temperature, and humidity patterns) and trains an XGBoost classifier in-memory, deterministically (fixed random seed), in a few seconds. This avoids shipping large `.pkl` binaries in the repo while guaranteeing the exact same model logic runs locally, in the notebook, and in both production deployments. See `models/README.md` for the full rationale.

```
clisense/
├── README.md                    # This file
├── requirements.txt              # Python dependencies
├── BUGFIX_REPORT.md               # Real incident: root cause + fix, with before/after HTTP evidence
├── DEPLOYMENT_GUIDE.md            # Step-by-step deployment instructions (Streamlit Cloud + Railway)
├── VIDEO_DEMO_SCRIPT.md           # Script used to record the 5-minute demo video
├── .streamlit/
│   └── config.toml                # Streamlit theme configuration
├── app/
│   ├── model_core.py               # Shared data generation, training & prediction logic (single source of truth)
│   ├── streamlit_app.py            # Streamlit dashboard (4 tabs: Predict, Explore, Model Info, About)
│   └── api.py                      # FastAPI backend (/predict, /health, /states)
├── data/
│   ├── README.md
│   ├── nigeria_climate_2015_2024.csv   # Committed 1,500-row reproducible sample of the dataset
│   └── generate_nigeria_climate_data.py # Script to regenerate the full 18,530-row dataset
├── models/
│   └── README.md                   # Explains the train-on-startup design (no committed .pkl files)
├── notebooks/
│   ├── README.md
│   └── Clisense_ML_Notebook.ipynb   # Real, runnable notebook: EDA, training, evaluation
├── assets/
│   ├── README.md
│   ├── fig_feature_importance.png
│   ├── fig_seasonal_threat_heatmap.png
│   └── fig_unit_tests_passing.png
├── testing_screenshots/            # Evidence for every testing strategy (see Testing section below)
│   └── README.md
└── tests/
    └── test_clisense_unit.py        # 13 automated unit tests (pytest)
```

## Model Performance

Measured by actually running `notebooks/Clisense_ML_Notebook.ipynb` end-to-end in Google Colab against the real 18,530-row dataset (80/20 stratified train/test split, fixed seed):

| Metric | Score |
|---|---|
| Model | XGBoost (`XGBClassifier`, multiclass softmax) |
| Test Accuracy | 99.68% |
| Weighted F1-Score | 0.9968 |
| Training samples | 14,824 |
| Test samples | 3,706 |
| Classes | Normal (~43%), Drought Risk (~16%), Flood Risk (~41%) |

Full confusion matrix and feature-importance charts are in `assets/`, and the notebook itself is viewable directly on GitHub.

## Installation & Setup (Run Locally)

**Prerequisites**: Python 3.10+ and `pip`.

1. Clone the repository:
   ```bash
   git clone https://github.com/AgbajeCity/clisense.git
   cd clisense
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI backend (in one terminal):
   ```bash
   uvicorn app.api:app --reload --port 8000
   ```
   The first request triggers model training (a few seconds). Visit http://127.0.0.1:8000/docs for the interactive Swagger UI.
5. Run the Streamlit dashboard (in a second terminal):
   ```bash
   streamlit run app/streamlit_app.py
   ```
   Visit http://localhost:8501 in your browser.
6. Run the automated test suite:
   ```bash
   pytest tests/test_clisense_unit.py -v
   ```
7. (Optional) Regenerate the dataset or explore the notebook:
   ```bash
   python data/generate_nigeria_climate_data.py --n 18530 --seed 42
   jupyter notebook notebooks/Clisense_ML_Notebook.ipynb
   ```

For deploying your own copy to Streamlit Cloud and Railway, see `DEPLOYMENT_GUIDE.md`.

## Testing Strategy

Five distinct testing strategies were used to validate Clisense; full evidence (terminal output and UI screenshots) is organized by folder in `testing_screenshots/`:

1. **Unit testing** — `tests/test_clisense_unit.py` (13 tests) covers dataset generation shape/columns, feature engineering, encoder/scaler consistency, and prediction output validity. Run with `pytest tests/test_clisense_unit.py -v`.
2. **Integration testing** — End-to-end requests through the live Streamlit dashboard and the live FastAPI `/predict` endpoint (via Swagger UI), confirming the full request → model → response path works in production for all three threat classes.
3. **Edge case testing** — Boundary and invalid inputs (out-of-range humidity, unknown state, extreme rainfall, minimum/maximum values) sent to the live `/predict` endpoint to confirm graceful validation and error handling.
4. **Data variation testing** — A matrix of inputs spanning all 5 states, multiple months/seasons, and all 3 threat classes, verifying the model responds sensibly to realistic input diversity rather than overfitting to one scenario.
5. **Cross-environment testing** — The deployed app verified across desktop and mobile viewport sizes, and the FastAPI backend's live `/health` endpoint checked to confirm the production (Railway) environment matches local behaviour.

## Known Issue & Fix (Real Bug, Documented)

During integration testing, a real `IndexError` was found in the prediction endpoint caused by a schema mismatch between the Streamlit app's local fallback-training path and the FastAPI backend's. It was root-caused, fixed by unifying both services on the single `app/model_core.py` module, and verified with live before/after HTTP responses. Full write-up: `BUGFIX_REPORT.md`.

## Recommendations & Future Work

- Replace the synthetic dataset with real historical climate records (e.g., NiMet or NASA POWER data) for the 5 target states to validate the model against ground truth.
- Add SMS/USSD delivery of predictions for farmers without smartphone or reliable data access, since the current dashboard requires internet access.
- Extend state coverage beyond the current 5 states toward a nationwide model, and add a lightweight on-device model option for offline use in low-connectivity areas.
- Introduce a feedback loop where farmers confirm actual outcomes (flood/drought/normal) to enable periodic model retraining and drift monitoring in production.

## Author

H. Ayomide Agbaje — ALU BSc Software Engineering, Cohort 14 — ALU Mission Capstone 2026, supervised by Ndinelao Iitumba.
