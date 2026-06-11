# models/

This directory contains trained ML model files for the Clisense climate prediction system.

## Model Files

| File | Description | Size |
|------|-------------|------|
| `clisense_model.pkl` | Primary GradientBoostingClassifier model | ~2.1 MB |
| `clisense_scaler.pkl` | StandardScaler fitted to training data | ~4 KB |
| `label_encoder.pkl` | LabelEncoder for target classes | ~1 KB |
| `feature_names.pkl` | List of feature names used in training | <1 KB |
| `model_metadata.json` | Training metadata: accuracy, parameters, date | ~2 KB |
| `xgboost_model.pkl` | XGBoost backup model | ~1.8 MB |

## Model Performance

| Metric | Value |
|--------|-------|
| Test Accuracy | 92.3% |
| Macro F1-Score | 0.921 |
| Training Samples | 34,560 |
| Test Samples | 8,640 |
| Cross-Val Score | 91.8% ± 1.2% |

## Classes

| Label | Description |
|-------|-------------|
| Normal | Low climate risk — regular farming conditions |
| Moderate Risk | Elevated risk — monitor conditions closely |
| Flood Risk | High flooding probability — delay planting, prepare drainage |
| Drought Risk | High drought probability — implement irrigation, conserve water |

## Regenerating Models

The Streamlit app and API both auto-generate and train models on first run if model files are not present:

```python
# Models are trained automatically when app starts
# See app/streamlit_app.py: train_and_cache_models()
# See app/api.py: startup_event()
```

To retrain manually:
```bash
cd clisense/
python -c "from app.streamlit_app import train_and_cache_models; train_and_cache_models()"
```

---
*Clisense — ALU Mission Capstone 2026 | H. Ayomide Agbaje*
