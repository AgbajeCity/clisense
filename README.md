# Clisense - Osun River Corridor Pilot (Osogbo, Osun State)

ML-powered predictive climate intelligence and early warning for smallholder
farmers in **Osogbo, Osun State, Nigeria**, in the Osun River flood corridor.
The system benchmarks four machine-learning architectures on two tasks and
serves the champion through a REST API and a browser-based forecast interface.

- **Forecast interface + API**: https://clisense-production.up.railway.app
- **API docs (Swagger)**: https://clisense-production.up.railway.app/docs
- **Health check**: https://clisense-production.up.railway.app/health
- **Repository**: https://github.com/AgbajeCity/clisense

## What it does

Two prediction tasks for the Osogbo gauge / Osun River corridor:

1. **Flood classification** - is a given day a flood-risk day? (binary)
2. **72-hour temperature forecasting** - land-surface temperature three days out.

Four architectures are benchmarked against a naive persistence baseline:
**Random Forest**, **XGBoost**, **Decision Tree**, and a **Multi-Layer Perceptron**.
Random Forest is the champion on both tasks.

## Results (2024 held-out test set, 363 records)

| Model | Flood accuracy | Flood F1 | Temp within +/-2 C |
|-------|---------------:|---------:|-------------------:|
| **Random Forest (champion)** | **93.4%** | **87.4%** | **91.5%** |
| XGBoost | 91.7% | 83.9% | 90.9% |
| Decision Tree | 92.6% | 85.7% | 86.5% |
| MLP Neural Network | 93.1% | 86.0% | 86.5% |
| Persistence baseline | 90.1% | 80.4% | 86.0% |

Discharge features (current discharge and its 1- and 3-day lags) account for
~59% of the flood model's importance. Full metrics are in
`models/benchmark_metrics.json`; figures are in `assets/`.

## Architecture

`app/model_core.py` is the single source of truth: it generates the disclosed
synthetic dataset, engineers the features, and trains the champion Random Forest
models. `app/benchmark.py` runs the four-model comparison with GridSearchCV
(TimeSeriesSplit) on Random Forest and XGBoost and writes the metrics and figures.
`app/api.py` is a FastAPI service that loads (or trains once, deterministically)
the champion artefacts and exposes `/predict`, `/health`, and `/benchmark`. The
browser interface in `web/index.html` is plain HTML and JavaScript that calls the
API and renders the live benchmark table.

## Dataset (disclosed synthetic)

Live CHIRPS, MODIS, NIHSA and CliNode feeds were not accessible in the development
environment, so a daily dataset (2016-2024, ~3,282 records) was generated to
reflect the corridor's published hydrology: a wet-season discharge peak of
~150 m3/s in August-September at the Osogbo gauge (Ogundolie et al., 2024), a
skewed rainfall curve peaking in late August, autocorrelated land-surface
temperature, and soil moisture and a vegetation index coupled to rolling rainfall.
The overall flood rate is ~25%. Every value is generated, not measured.

## Run locally

```bash
pip install -r requirements.txt
python -m app.benchmark          # train, benchmark, write metrics + figures
uvicorn app.api:app --reload     # serve API + interface at http://localhost:8000
pytest tests/                    # unit tests
```

## Repository layout

```
app/model_core.py     # data generation, features, champion models, predict_one
app/benchmark.py      # four-model benchmark, GridSearchCV, metrics, figures
app/api.py            # FastAPI: /predict, /health, /benchmark, interface at /
web/index.html        # plain HTML/JS forecast interface + benchmark table
models/               # champion joblib artefacts (regenerated) + benchmark_metrics.json
assets/               # confusion matrix, feature importance, seasonal risk figures
tests/                # pytest unit tests
data/                 # dataset export helper
```

## Not in this phase (future work)

Africa's Talking IVR/SMS delivery, the Yoruba voice layer, live CHIRPS/MODIS/NIHSA
ingestion, and the CliNode sensor network remain designed but unbuilt, and are the
recommendations in Chapter Six of the capstone report.
