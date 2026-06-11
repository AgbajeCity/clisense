# data/

This directory contains climate datasets for the Clisense ML pipeline.

## Contents

- `nigeria_climate_data.csv` — Historical climate dataset: 10 years (2014–2024) × 36 Nigerian states × monthly observations. Features: state, month, rainfall_mm, temperature_c, humidity_pct, climate_risk_label.
- `generate_nigeria_climate_data.py` — Script to regenerate the synthetic dataset using reproducible random seed.

## Dataset Statistics

| Attribute | Value |
|-----------|-------|
| Total records | ~43,200 (36 states × 120 months) |
| Features | 5 input + 1 target |
| Target classes | 4 (Normal, Moderate Risk, Flood Risk, Drought Risk) |
| States covered | All 36 Nigerian states + FCT |
| Time period | Jan 2014 – Dec 2024 |

## Data Dictionary

| Column | Type | Description |
|--------|------|-------------|
| state | string | Nigerian state name |
| month | int | Month (1–12) |
| rainfall_mm | float | Monthly rainfall in millimetres |
| temperature_c | float | Mean monthly temperature in Celsius |
| humidity_pct | float | Mean monthly relative humidity (%) |
| climate_risk | string | Target: Normal / Moderate Risk / Flood Risk / Drought Risk |

## Generating the Dataset

```bash
cd clisense/
python data/generate_nigeria_climate_data.py
```

This creates `data/nigeria_climate_data.csv` for use in model training.

---
*Clisense — ALU Mission Capstone 2026 | H. Ayomide Agbaje*
