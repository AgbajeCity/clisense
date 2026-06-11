# notebooks/

This directory contains Jupyter notebooks for the Clisense ML pipeline.

## Contents

- `Clisense_EDA_and_Feature_Engineering.ipynb` — Exploratory data analysis, feature engineering, and visualisation of Nigeria climate dataset
- `Clisense_ML_Notebook_executed.ipynb` — Model training, evaluation, and selection (GradientBoostingClassifier, XGBoost, RandomForest). Contains executed outputs including accuracy metrics, confusion matrix, and feature importance plots.

## Model Performance Summary

| Model | Accuracy | F1-Score |
|-------|----------|----------|
| Gradient Boosting | 92.3% | 0.921 |
| XGBoost | 91.8% | 0.916 |
| Random Forest | 89.4% | 0.891 |

## How to Run

```bash
cd clisense/
pip install -r requirements.txt
jupyter notebook notebooks/
```

*Note: Notebooks require the dataset in data/ directory. Run data/generate_nigeria_climate_data.py first if data files are not present.*

---
*Clisense — ALU Mission Capstone 2026 | H. Ayomide Agbaje*
