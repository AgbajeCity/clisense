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
## Installation and Setup (Step by Step)

Requirements: Python 3.10 or higher, pip, and Git.

1. Clone the repository:
2. ```
   git clone https://github.com/AgbajeCity/clisense.git
   cd clisense
   ```
   2. Create and activate a virtual environment:
   3. ```
      python -m venv venv
      source venv/bin/activate
      ```
      On Windows use venv\Scripts\activate instead.

      3. Install dependencies:
      4. ```
         pip install -r requirements.txt
         ```
         4. Run the notebook (optional, regenerates model artifacts and figures):
         5. ```
            jupyter notebook notebooks/Clisense_ML_Notebook_executed.ipynb
            ```
            5. Run the Streamlit dashboard locally:
            6. ```
               streamlit run app/streamlit_app.py
               ```
               Open http://localhost:8501 in a browser.

               6. Run the FastAPI backend locally (in a separate terminal):
               7. ```
                  uvicorn app.api:app --reload --port 8000
                  ```
                  Open http://localhost:8000/docs for the Swagger UI.

                  7. Run the unit tests:
                  8. ```
                     pytest tests/test_clisense_unit.py -v
                     ```
## Testing

Five testing strategies were used to validate Clisense, with full test cases, edge case tables, and screenshots organized in the testing_screenshots/ folder (see testing_screenshots/README.md).

- Unit testing: pytest tests/test_clisense_unit.py covers the prediction logic, scaler, and encoders (14 tests).
- - Integration testing: End-to-end runs through the Streamlit UI and FastAPI Swagger UI producing Normal, Drought Risk, and Flood Risk predictions.
  - - Edge case testing: Boundary inputs such as missing values, invalid state or month, and extreme humidity, run through the /predict endpoint.
    - - Data variation testing: A matrix of 15 cases spanning all five states, multiple months and seasons, and all three threat classes.
      - - Cross-environment testing: Chrome vs Firefox, mobile viewport vs desktop, and local vs deployed inference latency.
       
        - Full deployment steps and a post-deployment verification checklist are in DEPLOYMENT_GUIDE.md.
       
        - ## Video Demo
        - 
        [Link to the 5-minute demo video - paste here after recording]

A full script and shot list is in VIDEO_DEMO_SCRIPT.md.

## Recommendations and Future Work

For the community: partner with Nigeria's Agricultural Development Programme extension officer network to route alerts through trusted local channels, replace the current synthetic training data with live NASA POWER or CHIRPS feeds before relying on this for real alerting, and build the SMS/USSD delivery pipeline so alerts reach farmers on basic phones.

For future technical work: a Bidirectional LSTM for genuine time-series forecasting, expanding beyond the current 5 states to fuller Nigerian agro-ecological coverage, crop-specific risk modeling, and formal validation of the computed threat labels against NIMET's official drought and flood incident records.


                     


*ALU Mission Capstone 2026 — Machine Learning Track*

## Critical Bug Fix (Testing Finding)

During live system testing, a critical bug was found that caused every prediction request
on both the deployed Streamlit app and the FastAPI backend to fail with a server error.
The root cause, the fix, and verified live re-test results (real HTTP responses, not
fabricated) are fully documented in [BUGFIX_REPORT.md](BUGFIX_REPORT.md).
