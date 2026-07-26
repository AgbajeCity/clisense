# Clisense - Osun River Corridor Pilot (Osogbo, Osun State)

ML-powered predictive climate intelligence and early warning for smallholder
farmers in **Osogbo, Osun State, Nigeria**, in the Osun River flood corridor.
The system benchmarks four machine-learning architectures on flood
classification and serves the champion through a REST API and a browser-based
forecast interface.

- **Forecast interface + API**: https://clisense.onrender.com
- **API docs (Swagger)**: https://clisense.onrender.com/docs
- **Health check**: https://clisense.onrender.com/health
- **Repository**: https://github.com/AgbajeCity/clisense

## What it does

One prediction task for the Osogbo gauge / Osun River corridor:

1. **Flood classification** - is a given day a flood-risk day? (binary)

Four architectures are benchmarked against a naive persistence baseline:
**Random Forest**, **XGBoost**, **Decision Tree**, and a **Multi-Layer Perceptron**,
on real historical rainfall (see Dataset below). **MLP Neural Network** wins
(highest F1) and is the deployed champion.

## Results (2024 held-out test set, 366 records)

| Model | Flood accuracy | Flood F1 |
|-------|---------------:|---------:|
| Random Forest | 91.8% | 82.8% |
| XGBoost | 90.2% | 79.3% |
| Decision Tree | 86.9% | 73.3% |
| **MLP Neural Network (champion)** | **91.8%** | **83.9%** |
| Persistence baseline | 89.6% | 79.1% |

Random Forest and MLP tie on accuracy (91.8%); champion selection uses F1,
where MLP leads. Discharge features (current discharge and its 1- and 3-day
lags) account for ~74% of the champion's importance (permutation importance,
since MLP has no native `feature_importances_`). Full metrics are in
`models/benchmark_metrics.json`; figures are in `assets/`.

## Architecture

`app/model_core.py` is the single source of truth: it assembles the dataset,
engineers the features, and trains the champion flood-classification model
(whichever architecture the benchmark found best - see `CHAMPION_FLOOD_MODEL`).
`app/benchmark.py` runs the four-model comparison with GridSearchCV
(TimeSeriesSplit) on Random Forest and XGBoost and writes the metrics and
figures.
`app/api.py` is a FastAPI service that loads (or trains once, deterministically)
the champion artefact and exposes `/predict`, `/health`, and `/benchmark`. The
browser interface in `web/index.html` is plain HTML and JavaScript that calls the
API and renders the live benchmark table.

## Dataset (real rainfall, derived discharge)

Same-day rainfall is real historical daily data for the Osogbo corridor
(7.7667N, 4.5667E), 2016-2024, pulled from NASA POWER (MERRA-2 reanalysis) -
see `data/fetch_real_climate.py`. (NASA POWER also returns temperature in the
same call; it is not used by the flood classifier.) Direct NIHSA river-gauge
and CliNode field-sensor feeds were not accessible in the development
environment, so river discharge is derived from that real rainfall via a
rainfall-runoff transfer function calibrated to the corridor's published
Aug-Sep discharge peak of ~150 m3/s (Ogundolie et al., 2024); soil moisture
and a vegetation index are similarly derived, coupled to real 30-day
rainfall. ~3,285 daily records after dropping rows without full lag context,
overall flood rate ~25%. Full provenance disclosure in `data/README.md` and
the `app/model_core.py` module docstring.

## Run locally

```bash
pip install -r requirements.txt
python -m data.fetch_real_climate  # pull real NASA POWER rainfall/temperature (one-time)
python -m app.benchmark            # train, benchmark, write metrics + figures
uvicorn app.api:app --reload       # serve API + interface at http://localhost:8000
pytest tests/                      # unit tests
```

## Deployment

The live service runs on Render's free tier as a single FastAPI web service that
serves both the REST API and the browser interface from one origin.

- Live URL: https://clisense.onrender.com
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.api:app --host 0.0.0.0 --port $PORT`
- Config: `render.yaml` (checked into the repo)

The free instance spins down after inactivity, so the first request after an idle
period takes ~50 seconds to wake; subsequent requests are immediate.

### Redeploy

1. Push changes to `main` on GitHub.
2. In the Render dashboard, open the `clisense` service and click **Manual Deploy ->
   Deploy latest commit** (the service was created from the public repo URL, so it
   does not auto-deploy on push).
3. Watch the deploy logs until you see `Your service is live`, then confirm
   `https://clisense.onrender.com/health` returns `{"status":"healthy", ...}`.

To recreate the service from scratch: Render dashboard -> **New -> Web Service ->
Public Git Repository**, paste `https://github.com/AgbajeCity/clisense`, pick the
**Free** instance, and keep the build/start commands above (Render also reads them
from `render.yaml`).

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

72-hour temperature forecasting was benchmarked in an earlier iteration
(XGBoost champion) but has been descoped from this phase to keep the
capstone deliverable focused on the single, better-validated flood
classification task. Africa's Talking IVR/SMS delivery, the Yoruba voice
layer, live CHIRPS/MODIS/NIHSA ingestion, and the CliNode sensor network
remain designed but unbuilt, and are the recommendations in Chapter Six of
the capstone report.
