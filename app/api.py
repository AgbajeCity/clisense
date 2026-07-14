"""
api.py - FastAPI inference service for the Osogbo / Osun River corridor pilot.

Endpoints:
  GET  /health     - service and model readiness
  POST /predict    - flood classification + probability + 72-hour temperature
  GET  /benchmark  - the four-model benchmark table (for the interface)
  GET  /           - the browser-based forecast interface (static HTML/JS)

The champion Random Forest artefacts are loaded from models/ if present, or
trained once on startup (deterministic, seed-fixed) and cached.
"""
from __future__ import annotations

import json
import os

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app import model_core as mc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT, "models")
WEB_DIR = os.path.join(ROOT, "web")

_bundle = None


def get_bundle():
    global _bundle
    if _bundle is not None:
        return _bundle
    fp = os.path.join(MODELS_DIR, "flood_rf.joblib")
    tp = os.path.join(MODELS_DIR, "temp_rf.joblib")
    if os.path.exists(fp) and os.path.exists(tp):
        _bundle = {"flood_model": joblib.load(fp), "temp_model": joblib.load(tp)}
    else:
        os.makedirs(MODELS_DIR, exist_ok=True)
        _bundle = mc.train_champion()
        joblib.dump(_bundle["flood_model"], fp)
        joblib.dump(_bundle["temp_model"], tp)
    return _bundle


app = FastAPI(title="Clisense - Osun River Corridor Forecast API", version="2.0.0",
              description="Flood classification and 72-hour temperature forecasting "
                          "for smallholder farmers in Osogbo, Osun State, Nigeria.")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])


class PredictionRequest(BaseModel):
    community: str = Field("Osogbo", examples=["Osogbo"])
    month: int = Field(..., ge=1, le=12, examples=[8])
    rainfall_mm: float = Field(..., ge=0, description="Same-day rainfall (mm)", examples=[45.0])
    rain_30d: float = Field(..., ge=0, description="30-day cumulative rainfall (mm)", examples=[620.0])
    discharge_m3s: float = Field(..., ge=0, description="Osun River discharge (m3/s)", examples=[142.0])


@app.get("/health")
def health():
    b = get_bundle()
    return {
        "status": "healthy",
        "model": "Random Forest (champion)",
        "community": mc.COMMUNITY,
        "state": mc.STATE,
        "tasks": ["flood_classification", "temperature_72h"],
        "flood_features": len(mc.FLOOD_FEATURES),
        "loaded": b is not None,
    }


@app.post("/predict")
def predict(req: PredictionRequest):
    if req.community.strip().lower() != "osogbo":
        raise HTTPException(status_code=400,
                            detail="This pilot covers Osogbo, Osun State only.")
    b = get_bundle()
    return mc.predict_one(b, req.month, req.rainfall_mm, req.rain_30d, req.discharge_m3s)


@app.get("/benchmark")
def benchmark():
    path = os.path.join(MODELS_DIR, "benchmark_metrics.json")
    if os.path.exists(path):
        with open(path) as fh:
            return json.load(fh)
    raise HTTPException(status_code=404,
                        detail="Benchmark metrics not found. Run: python -m app.benchmark")


if os.path.isdir(WEB_DIR):
    @app.get("/")
    def index():
        return FileResponse(os.path.join(WEB_DIR, "index.html"))
