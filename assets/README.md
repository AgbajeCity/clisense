# assets/

This directory contains real figures generated from an actual run of
`app/model_core.py` against the 18,530-row synthetic dataset, captured as
screenshots directly from the Google Colab session that trained the model
(see `notebooks/` for the notebook). These are not placeholders and not
stock images.

## Figures

| File | What it shows |
|---|---|
| `fig_seasonal_threat_heatmap.png` | Count of Normal / Drought Risk / Flood Risk records by month — shows Drought Risk concentrated in the Nov-Mar dry season and Flood Risk concentrated in the Apr-Oct wet season, exactly as the domain analysis predicts. |
| `fig_feature_importance.png` | XGBoost feature importance — `rain_30d`, `humidity_pct`, and `dry_spell_days` dominate, consistent with the agronomic reasoning in the README's Analysis section. |
| `fig_unit_tests_passing.png` | Full terminal output of `pytest tests/test_clisense_unit.py -v` — all 13 tests passing against a freshly trained model. |

## Regenerating these figures

Run the code in `notebooks/Clisense_ML_Notebook.ipynb`, or the equivalent
inline in the deployed Streamlit app's "Data Explorer" and "Model Performance"
tabs, which render the same charts live using `matplotlib`/`seaborn` against
the same `model_core` functions.
