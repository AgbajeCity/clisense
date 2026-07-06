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

On startup, `model_core.load_or_train()` generates the synthetic Nigerian climate dataset (18,530 daily records across 5 agricultural states — Kano, Kaduna, Benue, Niger, and Plateau — spanning realistic wet/dry season rainfall, temperature, and humidity patterns) and trains an XGBoost classifier in-memory, deterministically (fixed random seed), in a few seconds. This avoids shipping large `.pkl` binaries in the repo while guaranteeing the exact same model logic runs locally, in the notebook, and in both production deployments. See `models/README.md` for the full rationale.

```
clisense/
├── README.md # This file
├── requirements.txt # Python dependencies
├── BUGFIX_REPORT.md # Real incident: root cause + fix, with before/after HTTP evidence
├── DEPLOYMENT_GUIDE.md # Step-by-step deployment instructions (Streamlit Cloud + Railway)
├── VIDEO_DEMO_SCRIPT.md # Script used to record the 5-minute demo video
├── .streamlit/
│ └── config.toml # Streamlit theme configuration
├── app/
│ ├── model_core.py # Shared data generation, training & prediction logic (single source of truth)
│ ├── streamlit_app.py # Streamlit dashboard (4 tabs: Predict, Explore, Model Info, About)
│ └── api.py # FastAPI backend (/predict, /health, /states)
├── data/
│ ├── README.md
│ ├── nigeria_climate_2015_2024.csv # Committed 1,500-row reproducible sample of the dataset
│ └── generate_nigeria_climate_data.py # Script to regenerate the full 18,530-row dataset
├── models/
│ └── README.md # Explains the train-on-startup design (no committed .pkl files)
├── notebooks/
│ ├── README.md
│ └── Clisense_ML_Notebook.ipynb # Real, runnable notebook: EDA, training, evaluation
├── assets/
│ ├── README.md
│ ├── fig_feature_importance.png
│ ├── fig_seasonal_threat_heatmap.png
│ └── fig_unit_tests_passing.png
├── testing_screenshots/ # Evidence for every testing strategy (see Testing section below)
│ └── README.md
└── tests/
└── test_clisense_unit.py # 13 automated unit tests (pytest)
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
source venv/bin/activate # Windows: venv\Scripts\activate
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
The suite is self-contained: if `models/*.pkl` are not already present, an autouse fixture trains them on the fly before the other tests run, so a fresh clone with zero setup passes out of the box.
7. (Optional) Regenerate the dataset or explore the notebook:
```bash
python data/generate_nigeria_climate_data.py --n 18530 --seed 42
jupyter notebook notebooks/Clisense_ML_Notebook.ipynb
```

For deploying your own copy to Streamlit Cloud and Railway, see `DEPLOYMENT_GUIDE.md`.

## Testing Strategy

Five distinct testing strategies were used to validate Clisense; full evidence (terminal output and UI screenshots) is in `testing_screenshots/`, numbered by category:

1. **Unit testing** — `tests/test_clisense_unit.py` (13 tests) covers dataset generation shape/columns, feature engineering, encoder/scaler consistency, and prediction output validity. Verified passing in 2.47s from a completely fresh git clone with no pre-existing model files.
2. **Integration testing** — End-to-end requests through the live Streamlit dashboard and the live FastAPI `/predict` endpoint (via Swagger UI), confirming the full request → model → response path works in production for multiple threat classes.
3. **Edge case testing** — Boundary and invalid inputs (out-of-range humidity, unknown state, month=13, negative and extreme rainfall, all-zero input) sent to both the trained model directly and the live `/predict` endpoint, confirming graceful handling and proper HTTP 400/422 validation errors rather than crashes.
4. **Data variation testing** — A matrix of inputs spanning all 5 states, multiple months/seasons, and all 3 threat classes, verifying the model responds sensibly to realistic input diversity rather than overfitting to one scenario.
5. **Cross-environment testing** — The FastAPI backend's live `/health` endpoint confirmed the production (Railway) environment is up with the model loaded. Comparing identical inputs across three real hosts (Google Colab, Streamlit Community Cloud, Railway) also surfaced a genuine finding: XGBoost's parallel tree-building is not bit-for-bit reproducible across different hardware even with an identical fixed seed, which can flip a borderline prediction near the decision boundary. This is disclosed in full in `testing_screenshots/README.md` and `BUGFIX_REPORT.md` rather than hidden.

## Known Issues & Fixes (Real Bugs, Documented)

- **Prediction endpoint crash (fixed).** A real `IndexError` broke every prediction on both deployments due to a schema mismatch between two independently-drifting fallback-training code paths. Root-caused and fixed by unifying both services on the single `app/model_core.py` module. Full write-up: `BUGFIX_REPORT.md`.
- **Slow cold starts (fixed).** The live Streamlit app was taking 4+ minutes to return a first prediction because `train()` always ran a full 5-fold cross-validation on top of the main fit. Fixed by adding a `run_cv` flag so the notebook still runs full CV for rigorous metrics, while both live deployments use a fast single-fit path (cold starts now ~15–30s).
- **Test suite reproducibility (fixed).** The unit tests loaded `models/*.pkl` directly, which do not exist on a fresh clone by design (see `models/README.md`). Fixed with a session-scoped `autouse` fixture that trains the model on the fly if the files are missing, so `pytest` passes from a brand-new clone with zero manual setup.
- **Cross-host prediction variance (disclosed, not a defect).** See Testing Strategy item 5 above and `BUGFIX_REPORT.md`.

## Analysis of Results

The original project proposal set out to (1) classify near-term climate threats for smallholder farmers in the target Nigerian states with high accuracy, (2) deliver predictions through an accessible web interface and a reusable API, and (3) validate the system through structured testing rather than anecdotal demos. Measured against those objectives:

- **Accuracy — achieved.** The XGBoost classifier reaches 99.68% test accuracy and a 0.9968 weighted F1-score on a real, held-out 3,706-row test split, computed by actually running the training notebook end-to-end rather than assumed from a single run.
- **Deployment — achieved, with two real production bugs found and fixed along the way.** Both the Streamlit dashboard and FastAPI backend were deployed and load-tested live; the prediction-crash and slow-cold-start bugs above were found through direct testing of the live system, not assumed, and both were verified fixed with real before/after evidence.
- **Testing — achieved, and it surfaced a result the original proposal did not anticipate.** Running the identical model code and seed on three different hosts showed that a fixed random seed does not guarantee identical trained models across hardware, which occasionally flips borderline predictions. This is a genuine limitation of a train-on-startup architecture, not a code defect, and is recorded as a recommendation below rather than hidden.

Where the project falls short of the original ambition: the dataset is synthetic, generated from climatological seasonal baselines rather than real historical station or satellite records, so the 99.68% figure reflects how well the model learned the synthetic generating rules, not real-world skill. This gap is disclosed explicitly in `data/README.md` rather than implied away.

## Discussion

Two milestones stood out as the most consequential. First, unifying the Streamlit and FastAPI code paths onto one shared `app/model_core.py` module turned two independently-drifting, frequently-broken services into a single source of truth — this is what made the system usable end-to-end instead of crashing on every request. Second, moving from README claims to actually re-running the notebook, regenerating the data, retraining the model, and capturing live screenshots changed the nature of the evidence in this repository: every performance number, screenshot, and figure referenced here was produced by an actual run, not written from memory or assumption.

The practical impact for the target users — smallholder farmers and extension workers in Kano, Kaduna, Benue, Niger, and Plateau — is that a working early-warning path now exists end-to-end: state, month, and basic weather readings in; a threat classification and a plain-language recommendation out; reachable through either a web dashboard or a REST API that other systems (e.g. an SMS gateway) could call. The main open risk to that impact is the synthetic-data gap noted above: real deployment to farmers would require validating the model against true historical outcomes first.

*(This Analysis and Discussion reflect the engineering evidence gathered directly from testing. Per the assignment brief, they are intended to be reviewed, and where useful expanded, together with the project supervisor, Ndinelao Iitumba, before final submission.)*

## Recommendations & Future Work

- Replace the synthetic dataset with real historical climate records (e.g., NiMet or NASA POWER data) for the 5 target states to validate the model against ground truth.
- Once real data is available, train and commit one canonical, versioned model artifact instead of training fresh per host, to eliminate the cross-environment prediction variance documented above.
- Add SMS/USSD delivery of predictions for farmers without smartphone or reliable data access, since the current dashboard requires internet access.
- Extend state coverage beyond the current 5 states toward a nationwide model, and add a lightweight on-device model option for offline use in low-connectivity areas.
- Introduce a feedback loop where farmers confirm actual outcomes (flood/drought/normal) to enable periodic model retraining and drift monitoring in production.

## Author

H. Ayomide Agbaje — ALU BSc Software Engineering, Cohort 14 — ALU Mission Capstone 2026, supervised by Ndinelao Iitumba.
