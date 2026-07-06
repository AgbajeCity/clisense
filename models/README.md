# models/

This directory is intentionally NOT used to ship large binary model files
(`.pkl`). Instead, the model, scaler, and encoders are trained automatically
the first time the app starts, using the single training function in
`app/model_core.py` (`train()` / `load_or_train()`).

## Why no committed .pkl files

An earlier version of this project attempted to commit trained `.pkl` files,
but they were never actually pushed correctly (the folder only ever contained
this README), which caused a real, reproducible bug: both the Streamlit app
and the FastAPI backend crashed on every prediction because their local
fallback-training code paths had drifted apart and used incompatible feature
schemas. Full incident write-up: see `BUGFIX_REPORT.md` at the repo root.

Rather than re-introduce large binary artifacts (which are also awkward to
diff and review in a student capstone repo), the fix keeps model training
fast, deterministic, and reproducible: `model_core.train()` trains an XGBoost
classifier in under 5 seconds on the 18,530-row synthetic dataset, and
`save_bundle()` persists the result to this folder at runtime as:

- `clisense_xgb_model.pkl` — trained XGBoost classifier
- `clisense_scaler.pkl` — fitted StandardScaler
- `clisense_le_state.pkl`, `clisense_le_season.pkl`, `clisense_le_zone.pkl` — label encoders
- `features.json` — feature names, fixed class index mapping, and supported states
- `model_metadata.json` — full metrics from the training run that produced these files (accuracy, F1, recall, confusion matrix, feature importances)

## Reproducing the model locally

```python
from app import model_core as mc
bundle, metrics, df = mc.train()
mc.save_bundle(bundle, metrics)
print(metrics["accuracy"], metrics["weighted_f1"])
```

## Real measured performance (XGBoost, 18,530 samples, seed 42)

| Metric | Value |
|---|---|
| Algorithm | XGBoost (400 trees, max depth 6, lr 0.05) |
| Test accuracy | 99.68% |
| Weighted F1 | 0.9968 |
| Weighted recall | 0.9968 |
| 5-fold CV F1 | 0.9958 (+/- 0.0018) |

These numbers are computed live every time `app/streamlit_app.py` starts
(see the "Model Performance" tab) — they are not hardcoded, and they will
match what you get if you run `model_core.train()` yourself with the same seed.

## Classes

| Index | Label | Description |
|---|---|---|
| 0 | Normal | Safe conditions for standard farming |
| 1 | Drought Risk | Water scarcity — conservation and irrigation advised |
| 2 | Flood Risk | Excessive rainfall — drainage and delayed planting advised |
