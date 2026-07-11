"""
Clisense FastAPI Backend - ALU Mission Capstone 2026

Thin HTTP layer over app/model_core.py. All feature engineering, training,
and prediction logic lives in model_core so the API and the Streamlit
dashboard can never drift apart again (see BUGFIX_REPORT.md).
"""
import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import model_core as mc

app = FastAPI(title="Clisense API", version="2.0.0")

# Allow the web frontend (and any browser client) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

_bundle = None


def get_bundle():
    global _bundle
    if _bundle is None:
        _bundle = mc.load_or_train()
    return _bundle


# Warm the model at startup so the first real request isn't the one that
# pays the (one-off) training cost.
get_bundle()


class PredictionRequest(BaseModel):
    state: str = Field(..., example="Kano")
    month: int = Field(..., ge=1, le=12, example=6)
    rainfall_mm: float = Field(..., ge=0, example=0.3)
    temp_c: float = Field(..., example=32.5)
    humidity_pct: float = Field(..., ge=0, le=100, example=32.0)
    rain_7d: float = Field(..., ge=0, example=2.1)
    rain_30d: float = Field(..., ge=0, example=12.0)


@app.get("/")
def root():
    return {"name": "Clisense API", "version": "2.0.0", "docs": "/docs"}


@app.get("/health")
def health():
    bundle = get_bundle()
    return {
        "status": "healthy",
        "model_loaded": bundle is not None,
        "algorithm": bundle.algorithm if bundle else None,
        "feature_count": mc.N_FEATURES,
    }


@app.get("/states")
def get_states():
    return {"states": mc.STATES}


_explore_cache = None
_model_info_cache = None


def _compute_explore():
    df = mc.generate_synthetic_dataset()
    g = (
        df.groupby(["state", "month"])
        .agg(
            rainfall_mm=("rainfall_mm", "mean"),
            temp_c=("temp_c", "mean"),
            humidity_pct=("humidity_pct", "mean"),
        )
        .reset_index()
    )
    monthly = [
        {
            "state": r.state,
            "month": int(r.month),
            "rainfall_mm": round(float(r.rainfall_mm), 1),
            "temp_c": round(float(r.temp_c), 1),
            "humidity_pct": round(float(r.humidity_pct), 1),
        }
        for r in g.itertuples()
    ]
    tbm = df.groupby(["month", "threat_label"]).size().unstack(fill_value=0)
    threat_by_month = []
    for m in range(1, 13):
        row = {"month": m}
        for cls in mc.LABEL_CLASSES:
            row[cls] = int(tbm.loc[m, cls]) if (m in tbm.index and cls in tbm.columns) else 0
        threat_by_month.append(row)
    class_distribution = {
        k: int(v) for k, v in df["threat_label"].value_counts().to_dict().items()
    }
    return {
        "states": mc.STATES,
        "monthly": monthly,
        "threat_by_month": threat_by_month,
        "class_distribution": class_distribution,
    }


@app.get("/explore")
def explore():
    global _explore_cache
    if _explore_cache is None:
        _explore_cache = _compute_explore()
    return _explore_cache


def _compute_model_info():
    metrics = None
    meta_path = Path(mc.MODELS_DIR) / "model_metadata.json"
    if meta_path.exists():
        try:
            metrics = json.loads(meta_path.read_text())
        except Exception:
            metrics = None
    if metrics is None or "feature_importances" not in metrics:
        _, metrics, _ = mc.train(run_cv=False)

    fi = metrics.get("feature_importances", {})
    fi_sorted = sorted(
        [{"feature": k, "importance": round(float(v), 4)} for k, v in fi.items()],
        key=lambda x: x["importance"],
        reverse=True,
    )
    return {
        "algorithm": metrics.get("algorithm", "XGBoost"),
        "accuracy": round(float(metrics.get("accuracy", 0)), 4),
        "weighted_f1": round(float(metrics.get("weighted_f1", 0)), 4),
        "n_samples": metrics.get("n_samples"),
        "n_train": metrics.get("n_train"),
        "n_test": metrics.get("n_test"),
        "classes": mc.LABEL_CLASSES,
        "class_distribution": metrics.get("class_distribution", {}),
        "feature_importances": fi_sorted,
        "confusion_matrix": metrics.get("confusion_matrix", []),
    }


@app.get("/model-info")
def model_info():
    global _model_info_cache
    if _model_info_cache is None:
        _model_info_cache = _compute_model_info()
    return _model_info_cache


@app.post("/predict")
def predict(req: PredictionRequest):
    if req.state not in mc.STATES:
        raise HTTPException(400, detail=f"State must be one of {mc.STATES}")
    bundle = get_bundle()
    result = mc.predict_one(
        bundle, req.state, req.month, req.rainfall_mm, req.temp_c,
        req.humidity_pct, req.rain_7d, req.rain_30d,
    )
    return result
