# Models

Champion artefact for the Osun River corridor pilot - whichever architecture
`app/benchmark.py`'s four-way comparison found best (see `app/model_core.py`'s
`CHAMPION_FLOOD_MODEL`):

- `flood_champion.joblib` - flood classifier (champion)
- `benchmark_metrics.json` - full four-model benchmark results (committed)

The `.joblib` artefact is large and is **not committed** (see `.gitignore`).
`app/api.py` loads it if present, otherwise trains it once on startup,
deterministically (fixed seed), from `app/model_core.py`, and caches it. Run
`python -m app.benchmark` to (re)generate the artefact and metrics locally.
