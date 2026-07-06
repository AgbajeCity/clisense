"""
Clisense FastAPI Backend - ALU Mission Capstone 2026

Thin HTTP layer over app/model_core.py. All feature engineering, training,
and prediction logic lives in model_core so the API and the Streamlit
dashboard can never drift apart again (see BUGFIX_REPORT.md).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

import model_core as mc

app = FastAPI(title="Clisense API", version="2.0.0")

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
