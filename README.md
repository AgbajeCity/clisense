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

This repository is a **monorepo** containing two parts of the same product:

| Part | Folder | Stack | What it is |
| ---- | ------ | ----- | ---------- |
| **ML app** | `app/`, `data/`, `models/`, `notebooks/`, `tests/` | Python, XGBoost, Streamlit, FastAPI | The model, training pipeline, analyst dashboard, and REST API |
| **Web frontend** | `web/` | React, Vite, TypeScript, Tailwind, shadcn-ui, Supabase | The public-facing product site and CliNode device experience |

---

## Live Demo

- **Streamlit Dashboard**: https://agbajecity-clisense.streamlit.app
- **FastAPI Backend**: https://clisense-production.up.railway.app
- **API Docs (Swagger)**: https://clisense-production.up.railway.app/docs
- **API Health Check**: https://clisense-production.up.railway.app/health
- **GitHub Repository**: https://github.com/AgbajeCity/clisense
- **Video Demo (5 min)**: https://drive.google.com/file/d/1b3KNZLvHxq7dCOks5nZZXpBxRQgEduaw/view?usp=sharing

---

## How It Works / Architecture

Both the Streamlit dashboard (`app/streamlit_app.py`) and the FastAPI backend (`app/api.py`) import a single shared module, `app/model_core.py`, which contains all data generation, training, and prediction logic. There is exactly one training code path, so the two deployed services can never drift apart or use incompatible feature schemas — this was the direct fix for a real bug documented in `BUGFIX_REPORT.md`.

On startup, `model_core.load_or_train()` generates the synthetic Nigerian climate dataset (18,530 daily records across 5 agricultural states — Kano, Kaduna, Benue, Niger, and Plateau — spanning realistic wet/dry season rainfall, temperature, and humidity patterns) and trains an XGBoost classifier in-memory, deterministically (fixed random seed), in a few seconds. This avoids shipping large `.pkl` binaries in the repo while guaranteeing the exact same model logic runs locally, in the notebook, and in both production deployments. See `models/README.md` for the full rationale.

The `web/` frontend is a separate React application for the product experience. It can run standalone against Supabase, and can also call the FastAPI `/predict` endpoint to surface live model predictions (see "Connecting the frontend to the API" below).

```
clisense/
├── README.md                          # This file
├── requirements.txt                   # Python dependencies
├── BUGFIX_REPORT.md                   # Real incident: root cause + fix, with HTTP evidence
├── DEPLOYMENT_GUIDE.md                # Deployment steps (Streamlit Cloud + Railway)
├── VIDEO_DEMO_SCRIPT.md               # Script for the 5-minute demo video
├── app/                               # ── PYTHON ML APP ──
│   ├── model_core.py                  # Shared data gen, training & prediction (single source of truth)
│   ├── streamlit_app.py               # Streamlit dashboard (Predict, Explore, Model Info, About)
│   └── api.py                         # FastAPI backend (/predict, /health, /states)
├── data/                              # Dataset sample + generator
├── models/                            # Train-on-startup design (no committed .pkl files)
├── notebooks/                         # Clisense_ML_Notebook.ipynb (EDA, training, evaluation)
├── assets/                            # Figures (feature importance, seasonal heatmap)
├── testing_screenshots/               # Evidence for every testing strategy
├── tests/                             # 13 automated unit tests (pytest)
└── web/                               # ── REACT WEB FRONTEND ──
    ├── src/                           # Pages, components, Supabase integration
    ├── package.json
    ├── vite.config.ts
    └── .env.example                   # Copy to .env, add Supabase values (never commit .env)
```

---

## Model Performance

Measured by running `notebooks/Clisense_ML_Notebook.ipynb` end-to-end against the real 18,530-row dataset (80/20 stratified train/test split, fixed seed):

| Metric            | Score                                                 |
| ----------------- | ----------------------------------------------------- |
| Model             | XGBoost (`XGBClassifier`, multiclass softmax)         |
| Test Accuracy     | 99.68%                                                |
| Weighted F1-Score | 0.9968                                                |
| Training samples  | 14,824                                                |
| Test samples      | 3,706                                                 |
| Classes           | Normal (~43%), Drought Risk (~16%), Flood Risk (~41%) |

Full confusion matrix and feature-importance charts are in `assets/`, and the notebook is viewable directly on GitHub.

---

## Setup — Run the ML App (Python)

**Prerequisites**: Python 3.10+ and `pip`. On macOS, XGBoost also needs the OpenMP runtime: `brew install libomp`.

```bash
git clone https://github.com/AgbajeCity/clisense.git
cd clisense
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run the FastAPI backend (first request triggers a few seconds of model training):

```bash
uvicorn app.api:app --reload --port 8000     # Swagger UI at http://127.0.0.1:8000/docs
```

Run the Streamlit dashboard (second terminal):

```bash
streamlit run app/streamlit_app.py           # http://localhost:8501
```

Run the automated test suite:

```bash
pytest tests/test_clisense_unit.py -v
```

The suite is self-contained: if `models/*.pkl` are missing, an autouse fixture trains them on the fly, so a fresh clone passes with zero setup.

---

## Setup — Run the Web Frontend (React)

**Prerequisites**: Node.js 18+ and `npm`.

```bash
cd web
cp .env.example .env      # then fill in your Supabase values
npm install
npm run dev               # http://localhost:8080
```

`web/.env` holds the Supabase project keys and is gitignored — never commit it.

### Connecting the frontend to the API

Set the API base URL in `web/.env`:

```
VITE_API_URL=http://localhost:8000                       # local FastAPI
# VITE_API_URL=https://clisense-production.up.railway.app  # or the deployed API
```

Run the FastAPI backend alongside the frontend, and the in-app climate-risk predictor will POST to `/predict` and display the Normal / Drought / Flood result.

---

## Testing Strategy

Five distinct testing strategies validate Clisense; full evidence (terminal output and UI screenshots) is in `testing_screenshots/`:

1. **Unit testing** — `tests/test_clisense_unit.py` (13 tests) covers dataset generation shape/columns, feature engineering, encoder/scaler consistency, and prediction output validity. Verified passing from a completely fresh clone with no pre-existing model files.
2. **Integration testing** — End-to-end requests through the live Streamlit dashboard and the live FastAPI `/predict` endpoint, confirming the full request → model → response path works in production for multiple threat classes.
3. **Edge case testing** — Boundary and invalid inputs (out-of-range humidity, unknown state, month=13, negative and extreme rainfall, all-zero input) confirming graceful handling and proper HTTP 400/422 validation rather than crashes.
4. **Data variation testing** — A matrix spanning all 5 states, multiple months/seasons, and all 3 threat classes, verifying the model responds sensibly to realistic input diversity.
5. **Cross-environment testing** — The live `/health` endpoint confirms the production environment is up with the model loaded. Comparing identical inputs across Google Colab, Streamlit Community Cloud, and Railway surfaced a genuine finding: XGBoost's parallel tree-building is not bit-for-bit reproducible across different hardware even with a fixed seed, which can flip a borderline prediction. This is disclosed in full in `testing_screenshots/README.md` and `BUGFIX_REPORT.md` rather than hidden.

---

## Known Issues & Fixes (Real Bugs, Documented)

- **Prediction endpoint crash (fixed).** A real `IndexError` broke every prediction on both deployments due to a schema mismatch between two independently-drifting fallback-training code paths. Root-caused and fixed by unifying both services on `app/model_core.py`. Full write-up: `BUGFIX_REPORT.md`.
- **Slow cold starts (fixed).** The live Streamlit app took 4+ minutes to return a first prediction because `train()` always ran a full 5-fold cross-validation. Fixed with a `run_cv` flag so the notebook still runs full CV for rigorous metrics while both live deployments use a fast single-fit path (cold starts now ~15–30s).
- **Test suite reproducibility (fixed).** The unit tests loaded `models/*.pkl` directly, which do not exist on a fresh clone by design. Fixed with a session-scoped autouse fixture that trains the model on the fly if the files are missing.
- **Cross-host prediction variance (disclosed, not a defect).** See Testing Strategy item 5 and `BUGFIX_REPORT.md`.

---

## Analysis of Results

The project set out to (1) classify near-term climate threats with high accuracy, (2) deliver predictions through an accessible interface and a reusable API, and (3) validate the system through structured testing rather than anecdotal demos.

- **Accuracy — achieved.** 99.68% test accuracy and a 0.9968 weighted F1-score on a real, held-out 3,706-row test split, computed by running the training notebook end-to-end.
- **Deployment — achieved, with two real production bugs found and fixed.** Both the dashboard and API were deployed and load-tested live; the prediction-crash and slow-cold-start bugs were found through direct testing and verified fixed with before/after evidence.
- **Testing — achieved, and it surfaced an unanticipated result.** A fixed seed does not guarantee identical trained models across hardware, which occasionally flips borderline predictions — a genuine limitation of a train-on-startup architecture, recorded as a recommendation rather than hidden.

Where the project falls short of the original ambition: the dataset is synthetic, generated from climatological seasonal baselines rather than real historical station or satellite records, so the 99.68% figure reflects how well the model learned the synthetic generating rules, not real-world skill. This gap is disclosed explicitly in `data/README.md`.

---

## Discussion

Two milestones stood out. First, unifying the Streamlit and FastAPI code paths onto one shared `app/model_core.py` module turned two independently-drifting, frequently-broken services into a single source of truth — this is what made the system usable end-to-end instead of crashing on every request. Second, moving from README claims to actually re-running the notebook, regenerating the data, retraining the model, and capturing live screenshots changed the nature of the evidence: every performance number, screenshot, and figure here was produced by an actual run.

The practical impact for the target users — smallholder farmers and extension workers in Kano, Kaduna, Benue, Niger, and Plateau — is that a working early-warning path now exists end-to-end: state, month, and basic weather readings in; a threat classification and plain-language recommendation out; reachable through a dashboard, a REST API, or the web frontend. The main open risk is the synthetic-data gap noted above.

*(This Analysis and Discussion reflect the engineering evidence gathered directly from testing. Per the assignment brief, they are intended to be reviewed, and where useful expanded, together with the project supervisor, Ndinelao Iitumba, before final submission.)*

---

## Recommendations & Future Work

- Replace the synthetic dataset with real historical climate records (e.g., NiMet or NASA POWER) for the 5 target states to validate against ground truth.
- Once real data is available, train and commit one canonical, versioned model artifact instead of training fresh per host, to eliminate cross-environment prediction variance.
- Add SMS/USSD delivery of predictions for farmers without smartphone or reliable data access.
- Extend state coverage beyond the current 5 states toward a nationwide model, and add a lightweight on-device model option for offline use.
- Introduce a feedback loop where farmers confirm actual outcomes to enable periodic retraining and drift monitoring.

---

## Author

H. Ayomide Agbaje — ALU BSc Software Engineering, Cohort 14 — ALU Mission Capstone 2026, supervised by Ndinelao Iitumba.
