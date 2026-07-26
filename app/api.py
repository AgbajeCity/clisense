"""
api.py - FastAPI inference service for the Osogbo / Osun River corridor pilot.

Endpoints:
  GET  /health     - service and model readiness
  POST /predict    - flood classification + probability
  GET  /benchmark  - the four-model benchmark table (for the interface)
  GET  /           - the browser-based forecast interface (static HTML/JS)

The champion model (whichever architecture app/benchmark.py's four-way
comparison found best - see app/model_core.py's CHAMPION_FLOOD_MODEL) is
loaded from models/ if present, or trained once on startup (deterministic,
seed-fixed) and cached.
"""
from __future__ import annotations

import json
import os
import threading

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
_bundle_lock = threading.Lock()


def get_bundle():
    """Return the cached model bundle, loading or training it on first call.

    Guarded by a lock so concurrent requests during a cold start (the common
    case right after a Render free-tier instance wakes up) can't each observe
    `_bundle is None` and kick off a redundant, several-second training run.
    """
    global _bundle
    if _bundle is not None:
        return _bundle
    with _bundle_lock:
        if _bundle is not None:  # re-check: another thread may have finished while we waited
            return _bundle
        fp = os.path.join(MODELS_DIR, "flood_champion.joblib")
        if os.path.exists(fp):
            # A cached artefact on disk is only ever written by app/benchmark.py
            # after its guardrail confirms the winner matches this constant,
            # so it's safe to label the loaded model with it.
            _bundle = {"flood_model": joblib.load(fp),
                      "flood_model_name": mc.CHAMPION_FLOOD_MODEL}
        else:
            # Cold start with no cached artefact (e.g. Render free tier, where
            # models/*.joblib is gitignored by design): retrain from scratch,
            # deploying the same champion architecture pinned in model_core.py.
            os.makedirs(MODELS_DIR, exist_ok=True)
            _bundle = mc.train_champion()
            joblib.dump(_bundle["flood_model"], fp)
    return _bundle


app = FastAPI(title="Clisense - Osun River Corridor Forecast API", version="2.0.0",
              description="Flood classification for smallholder farmers in "
                          "Osogbo, Osun State, Nigeria.")
# Public, read-only demo API: no cookies or auth headers are used, so a wildcard
# origin is safe. allow_credentials must stay False here - browsers reject the
# allow_origins="*" + allow_credentials=True combination outright, which would
# silently break cross-origin requests from anything but the same-origin dashboard.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False,
                   allow_methods=["GET", "POST"], allow_headers=["*"])


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
        "model": f"{b['flood_model_name']} (flood champion)",
        "community": mc.COMMUNITY,
        "state": mc.STATE,
        "tasks": ["flood_classification"],
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
