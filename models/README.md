# Models

Champion **Random Forest** artefacts for the Osun River corridor pilot:

- `flood_rf.joblib` - flood classifier (champion)
- `temp_rf.joblib` - 72-hour temperature regressor (champion)
- `benchmark_metrics.json` - full four-model benchmark results (committed)

The `.joblib` artefacts are large and are **not committed** (see `.gitignore`).
`app/api.py` loads them if present, otherwise trains them once on startup,
deterministically (fixed seed), from `app/model_core.py`, and caches them. Run
`python -m app.benchmark` to (re)generate the artefacts and metrics locally.
