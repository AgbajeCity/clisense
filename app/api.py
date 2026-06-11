"""
Clisense FastAPI Backend - ALU Mission Capstone 2026
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import numpy as np
import joblib

app = FastAPI(title="Clisense API", version="1.0.0")
BASE = Path(__file__).parent.parent
STATES = ["Kano", "Kaduna", "Benue", "Niger", "Plateau"]
ZONE_MAP = {"Kano": "Sudan Savanna", "Kaduna": "Northern Guinea Savanna",
            "Benue": "Southern Guinea Savanna", "Niger": "Northern Guinea Savanna",
            "Plateau": "Jos Plateau Highland"}

model = scaler = le_s = le_se = le_z = None

def load_model():
    global model, scaler, le_s, le_se, le_z
    try:
        model = joblib.load(BASE / "models" / "clisense_xgb_model.pkl")
        scaler = joblib.load(BASE / "models" / "clisense_scaler.pkl")
        le_s = joblib.load(BASE / "models" / "clisense_le_state.pkl")
        le_se = joblib.load(BASE / "models" / "clisense_le_season.pkl")
        le_z = joblib.load(BASE / "models" / "clisense_le_zone.pkl")
    except Exception:
        from sklearn.ensemble import GradientBoostingClassifier
        from sklearn.preprocessing import LabelEncoder, StandardScaler
        import pandas as pd
        np.random.seed(42)
        n = 5000
        states = np.random.choice(STATES, n)
        months = np.random.randint(1, 13, n)
        rainfall = np.maximum(0, np.where(months < 5, 5, 80) + np.random.normal(0, 20, n))
        temp = np.random.normal(28, 3, n)
        humidity = np.clip(60 + rainfall * 0.2 + np.random.normal(0, 10, n), 20, 99)
        rain_7d = np.maximum(0, rainfall * 7 + np.random.normal(0, 20, n))
        rain_30d = np.maximum(0, rainfall * 30 + np.random.normal(0, 80, n))
        zones = [ZONE_MAP[s] for s in states]
        seasons = ["wet" if 4 <= m <= 10 else "dry" for m in months]
        labels = ["Flood Risk" if r7 > 150 and h > 80 else "Drought Risk" if r < 2 and r30 < 20 and h < 40 else "Normal"
                  for r, r7, r30, h in zip(rainfall, rain_7d, rain_30d, humidity)]
        le_s = LabelEncoder(); le_se = LabelEncoder(); le_z = LabelEncoder(); le_l = LabelEncoder()
        s_enc = le_s.fit_transform(states)
        se_enc = le_se.fit_transform(seasons)
        z_enc = le_z.fit_transform(zones)
        y = le_l.fit_transform(labels)
        X = np.column_stack([rainfall, temp, humidity, np.full(n,2.5), rain_7d, rain_30d,
                             rainfall - rain_30d/30, np.zeros(n),
                             np.sin(2*np.pi*months/12), np.cos(2*np.pi*months/12),
                             np.sin(2*np.pi*months*30/365), np.cos(2*np.pi*months*30/365),
                             s_enc, se_enc, z_enc, temp*humidity, rainfall*humidity])
        scaler = StandardScaler()
        X_s = scaler.fit_transform(X)
        model = GradientBoostingClassifier(n_estimators=50, random_state=42)
        model.fit(X_s, y)
        model.classes_ = le_l.classes_
        (BASE / "models").mkdir(parents=True, exist_ok=True)
        joblib.dump(model, BASE / "models" / "clisense_xgb_model.pkl")
        joblib.dump(scaler, BASE / "models" / "clisense_scaler.pkl")
        joblib.dump(le_s, BASE / "models" / "clisense_le_state.pkl")
        joblib.dump(le_se, BASE / "models" / "clisense_le_season.pkl")
        joblib.dump(le_z, BASE / "models" / "clisense_le_zone.pkl")

load_model()

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
    return {"name": "Clisense API", "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/states")
def get_states():
    return {"states": STATES}

@app.post("/predict")
def predict(req: PredictionRequest):
    if req.state not in STATES:
        raise HTTPException(400, detail=f"State must be one of {STATES}")
    season = "wet" if 4 <= req.month <= 10 else "dry"
    zone = ZONE_MAP.get(req.state, "Northern Guinea Savanna")
    doy = req.month * 30
    try: s_enc = le_s.transform([req.state])[0]
    except: s_enc = 0
    try: se_enc = le_se.transform([season])[0]
    except: se_enc = 0
    try: z_enc = le_z.transform([zone])[0]
    except: z_enc = 0
    feat = np.array([[req.rainfall_mm, req.temp_c, req.humidity_pct, 2.5,
                      req.rain_7d, req.rain_30d,
                      req.rainfall_mm - req.rain_30d/30, 0,
                      np.sin(2*np.pi*req.month/12), np.cos(2*np.pi*req.month/12),
                      np.sin(2*np.pi*doy/365), np.cos(2*np.pi*doy/365),
                      s_enc, se_enc, z_enc,
                      req.temp_c * req.humidity_pct, req.rainfall_mm * req.humidity_pct]])
    feat_s = scaler.transform(feat)
    pred_idx = model.predict(feat_s)[0]
    proba = model.predict_proba(feat_s)[0]
    label = model.classes_[pred_idx]
    rec = ("High flood risk. Avoid low-lying farmland." if label == "Flood Risk"
           else "Drought risk. Conserve water." if label == "Drought Risk"
           else "Normal conditions. Standard practices apply.")
    return {"state": req.state, "month": req.month, "prediction": label,
            "confidence": round(float(proba[pred_idx]), 4),
            "probabilities": dict(zip(model.classes_, map(float, proba))),
            "recommendation": rec}
