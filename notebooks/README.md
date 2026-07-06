# notebooks/

- `Clisense_ML_Notebook.ipynb` — the real, runnable notebook: data generation,
  EDA, feature engineering explanation, XGBoost training, and evaluation
  (confusion matrix, feature importance). Every code cell calls the exact same
  `app/model_core.py` functions used by the deployed Streamlit app and FastAPI
  backend, so there is no separate "notebook model" that could drift from what
  is actually live. Open it directly on GitHub to read it rendered, or run it
  locally / in Colab.

## Running it

```bash
pip install -r requirements.txt
jupyter notebook notebooks/Clisense_ML_Notebook.ipynb
```

Or in Google Colab:

```python
!git clone https://github.com/AgbajeCity/clisense.git
%cd clisense
!pip install -q -r requirements.txt
```

then open `notebooks/Clisense_ML_Notebook.ipynb` from the Colab file browser.

Running all cells reproduces the real, measured results reported in the main
README and in `models/README.md`: XGBoost, 99.68% test accuracy, weighted F1
0.9968, 5-fold CV F1 0.9958.
