# Models

Champion artefacts for the Osun River corridor pilot - whichever architecture
`app/benchmark.py`'s four-way comparison found best per task (see
`app/model_core.py`'s `CHAMPION_FLOOD_MODEL` / `CHAMPION_TEMP_MODEL`):

- `flood_champion.joblib` - flood classifier (champion)
- `temp_champion.joblib` - 72-hour temperature regressor (champion)
- `benchmark_metrics.json` - full four-model benchmark results (committed)

The `.joblib` artefacts are large and are **not committed** (see `.gitignore`).
`app/api.py` loads them if present, otherwise trains them once on startup,
deterministically (fixed seed), from `app/model_core.py`, and caches them. Run
`python -m app.benchmark` to (re)generate the artefacts and metrics locally.
