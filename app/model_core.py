"""
Clisense -- Shared ML core.

Single source of truth for feature engineering, synthetic data generation,
and model training/loading, used by both the Streamlit dashboard
(app/streamlit_app.py) and the FastAPI backend (app/api.py).

Centralising this logic here fixes a real bug found during testing: the
Streamlit app and the API each used to keep their own copy of the feature
pipeline and had drifted apart (different dataset sizes, different feature
counts, different label encodings). See BUGFIX_REPORT.md for the incident
this module was built to permanently resolve.
"""

from __future__ import annotations

import json
from pathlib import Path
from dataclasses import dataclass, field

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import (
    accuracy_score, f1_score, recall_score, precision_score,
    confusion_matrix, classification_report,
)

try:
    from xgboost import XGBClassifier
    _HAS_XGBOOST = True
except ImportError:  # pragma: no cover - xgboost is declared in requirements.txt
    from sklearn.ensemble import GradientBoostingClassifier
    _HAS_XGBOOST = False

import joblib

BASE = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE / "models"

STATES = ["Kano", "Kaduna", "Benue", "Niger", "Plateau"]
ZONE_MAP = {
    "Kano": "Sudan Savanna",
    "Kaduna": "Northern Guinea Savanna",
    "Benue": "Southern Guinea Savanna",
    "Niger": "Northern Guinea Savanna",
    "Plateau": "Jos Plateau Highland",
}

# Fixed label encoding. Deliberately NOT sklearn's alphabetical LabelEncoder
# default (which would give Drought=0, Flood=1, Normal=2) because the test
# suite and the API both depend on this exact mapping.
LABEL_CLASSES = ["Normal", "Drought Risk", "Flood Risk"]
LABEL_TO_IDX = {name: i for i, name in enumerate(LABEL_CLASSES)}

FEATURE_NAMES = [
    "rainfall_mm", "temp_c", "humidity_pct", "wind_speed_kmh",
    "rain_7d", "rain_30d", "rain_anomaly", "dry_spell_days",
    "temp_anomaly", "sin_month", "cos_month", "sin_doy", "cos_doy",
    "state_enc", "season_enc", "zone_enc",
]
N_FEATURES = len(FEATURE_NAMES)


def _season(month) -> str:
    return "wet" if 4 <= month <= 10 else "dry"


def _label_for(rainfall, rain_7d, rain_30d, humidity) -> str:
    """Rule-based ground truth threat label, grounded in NIMET-style
    seasonal thresholds. See README 'Testing' and 'Analysis' sections."""
    if rain_7d > 150 and humidity > 80:
        return "Flood Risk"
    if rainfall < 2 and rain_30d < 20 and humidity < 40:
        return "Drought Risk"
    return "Normal"


def generate_synthetic_dataset(n: int = 18530, seed: int = 42) -> pd.DataFrame:
    """Generate the Clisense synthetic climate dataset.

    Honesty disclosure: this dataset is generated from climatological
    normals for the five covered states rather than pulled live from a
    sensor/satellite feed. See README 'Limitations'.
    """
    rng = np.random.default_rng(seed)
    states = rng.choice(STATES, n)
    months = rng.integers(1, 13, n)

    base_rain = np.select(
        [states == "Kano", states == "Benue"],
        [
            np.where((months < 5) | (months > 9), 5, 80),
            np.where((months < 4) | (months > 10), 20, 120),
        ],
        default=np.where((months < 5) | (months > 9), 10, 90),
    ).astype(float)

    rainfall = np.clip(rng.normal(base_rain, base_rain * 0.4 + 1e-6), 0, None)
    temp = rng.normal(28 + (months - 6) * 0.3, 3)
    humidity = np.clip(rng.normal(60 + rainfall * 0.2, 10), 20, 99)
    wind = np.clip(rng.normal(8, 3), 0, None)
    rain_7d = np.clip(rainfall * 7 + rng.normal(0, 20, n), 0, None)
    rain_30d = np.clip(rainfall * 30 + rng.normal(0, 80, n), 0, None)
    dry_spell = np.clip(30 - rain_30d / 10, 0, 30)
    temp_anomaly = rng.normal(0, 1.0, n)

    zones = np.array([ZONE_MAP[s] for s in states])
    seasons = np.array([_season(m) for m in months])
    labels = [
        _label_for(r, r7, r30, h)
        for r, r7, r30, h in zip(rainfall, rain_7d, rain_30d, humidity)
    ]

    df = pd.DataFrame({
        "state": states, "month": months, "season": seasons, "zone": zones,
        "rainfall_mm": rainfall.round(2), "temp_c": temp.round(2),
        "humidity_pct": humidity.round(2), "wind_speed_kmh": wind.round(2),
        "rain_7d": rain_7d.round(2), "rain_30d": rain_30d.round(2),
        "rain_anomaly": (rainfall - rain_30d / 30).round(2),
        "dry_spell_days": dry_spell.round(1),
        "temp_anomaly": temp_anomaly.round(2),
        "threat_label": labels,
    })
    return df


@dataclass
class ModelBundle:
    model: object
    scaler: StandardScaler
    le_state: LabelEncoder
    le_season: LabelEncoder
    le_zone: LabelEncoder
    algorithm: str = "XGBoost"


def engineer_features(df: pd.DataFrame, le_state, le_season, le_zone) -> np.ndarray:
    doy = df["month"] * 30
    return np.column_stack([
        df["rainfall_mm"], df["temp_c"], df["humidity_pct"], df["wind_speed_kmh"],
        df["rain_7d"], df["rain_30d"], df["rain_anomaly"], df["dry_spell_days"],
        df["temp_anomaly"],
        np.sin(2 * np.pi * df["month"] / 12), np.cos(2 * np.pi * df["month"] / 12),
        np.sin(2 * np.pi * doy / 365), np.cos(2 * np.pi * doy / 365),
        le_state.transform(df["state"]), le_season.transform(df["season"]),
        le_zone.transform(df["zone"]),
    ])


def engineer_single(state, month, rainfall_mm, temp_c, humidity_pct, rain_7d,
                     rain_30d, le_state, le_season, le_zone,
                     wind_speed_kmh=8.0, dry_spell_days=None, temp_anomaly=0.0):
    season = _season(month)
    zone = ZONE_MAP.get(state, "Northern Guinea Savanna")
    doy = month * 30
    rain_anomaly = rainfall_mm - rain_30d / 30
    if dry_spell_days is None:
        dry_spell_days = max(0.0, min(30.0, 30 - rain_30d / 10))

    def _safe(encoder, value, fallback=0):
        try:
            return encoder.transform([value])[0]
        except ValueError:
            return fallback

    feat = np.array([[
        rainfall_mm, temp_c, humidity_pct, wind_speed_kmh,
        rain_7d, rain_30d, rain_anomaly, dry_spell_days, temp_anomaly,
        np.sin(2 * np.pi * month / 12), np.cos(2 * np.pi * month / 12),
        np.sin(2 * np.pi * doy / 365), np.cos(2 * np.pi * doy / 365),
        _safe(le_state, state), _safe(le_season, season), _safe(le_zone, zone),
    ]])
    return feat


def train(df: "pd.DataFrame | None" = None, seed: int = 42):
    if df is None:
        df = generate_synthetic_dataset(seed=seed)

    le_state = LabelEncoder().fit(STATES)
    le_season = LabelEncoder().fit(["dry", "wet"])
    le_zone = LabelEncoder().fit(sorted(set(ZONE_MAP.values())))

    X = engineer_features(df, le_state, le_season, le_zone)
    y = df["threat_label"].map(LABEL_TO_IDX).values

    scaler = StandardScaler().fit(X)
    X_s = scaler.transform(X)

    X_train, X_test, y_train, y_test = train_test_split(
        X_s, y, test_size=0.2, random_state=seed, stratify=y
    )

    if _HAS_XGBOOST:
        model = XGBClassifier(
            n_estimators=400, max_depth=6, learning_rate=0.05,
            subsample=0.9, colsample_bytree=0.9,
            reg_alpha=0.1, reg_lambda=1.0,
            objective="multi:softprob", num_class=3,
            eval_metric="mlogloss", random_state=seed,
        )
        algo_name = "XGBoost"
    else:  # pragma: no cover
        model = GradientBoostingClassifier(n_estimators=400, max_depth=3, random_state=seed)
        algo_name = "GradientBoostingClassifier (XGBoost unavailable in this environment)"

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    cv_scores = cross_val_score(
        model, X_s, y, cv=StratifiedKFold(5, shuffle=True, random_state=seed),
        scoring="f1_weighted",
    )

    cm = confusion_matrix(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=LABEL_CLASSES, output_dict=True)

    try:
        importances = model.feature_importances_.tolist()
    except AttributeError:
        importances = [0.0] * N_FEATURES

    metrics = {
        "algorithm": algo_name,
        "n_samples": int(len(df)),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "weighted_f1": float(f1_score(y_test, y_pred, average="weighted")),
        "weighted_recall": float(recall_score(y_test, y_pred, average="weighted")),
        "weighted_precision": float(precision_score(y_test, y_pred, average="weighted")),
        "cv_f1_mean": float(cv_scores.mean()),
        "cv_f1_std": float(cv_scores.std()),
        "confusion_matrix": cm.tolist(),
        "classification_report": report,
        "feature_importances": dict(zip(FEATURE_NAMES, importances)),
        "class_distribution": df["threat_label"].value_counts().to_dict(),
    }

    bundle = ModelBundle(model, scaler, le_state, le_season, le_zone, algo_name)
    return bundle, metrics, df


def save_bundle(bundle: ModelBundle, metrics: dict) -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle.model, MODELS_DIR / "clisense_xgb_model.pkl")
    joblib.dump(bundle.scaler, MODELS_DIR / "clisense_scaler.pkl")
    joblib.dump(bundle.le_state, MODELS_DIR / "clisense_le_state.pkl")
    joblib.dump(bundle.le_season, MODELS_DIR / "clisense_le_season.pkl")
    joblib.dump(bundle.le_zone, MODELS_DIR / "clisense_le_zone.pkl")
    features_meta = {
        "features": FEATURE_NAMES,
        "classes": {str(i): name for i, name in enumerate(LABEL_CLASSES)},
        "states": STATES,
        "algorithm": bundle.algorithm,
        "metrics": {k: v for k, v in metrics.items()
                    if k not in ("confusion_matrix", "classification_report", "feature_importances")},
    }
    with open(MODELS_DIR / "features.json", "w") as f:
        json.dump(features_meta, f, indent=2)
    with open(MODELS_DIR / "model_metadata.json", "w") as f:
        json.dump(metrics, f, indent=2)


def load_bundle() -> "ModelBundle | None":
    try:
        model = joblib.load(MODELS_DIR / "clisense_xgb_model.pkl")
        scaler = joblib.load(MODELS_DIR / "clisense_scaler.pkl")
        le_state = joblib.load(MODELS_DIR / "clisense_le_state.pkl")
        le_season = joblib.load(MODELS_DIR / "clisense_le_season.pkl")
        le_zone = joblib.load(MODELS_DIR / "clisense_le_zone.pkl")
        with open(MODELS_DIR / "features.json") as f:
            meta = json.load(f)
        return ModelBundle(model, scaler, le_state, le_season, le_zone, meta.get("algorithm", "XGBoost"))
    except Exception:
        return None


def load_or_train() -> ModelBundle:
    bundle = load_bundle()
    if bundle is not None:
        return bundle
    bundle, metrics, _ = train()
    save_bundle(bundle, metrics)
    return bundle


def predict_one(bundle: ModelBundle, state, month, rainfall_mm, temp_c,
                 humidity_pct, rain_7d, rain_30d):
    feat = engineer_single(
        state, month, rainfall_mm, temp_c, humidity_pct, rain_7d, rain_30d,
        bundle.le_state, bundle.le_season, bundle.le_zone,
    )
    feat_s = bundle.scaler.transform(feat)
    pred_idx = int(bundle.model.predict(feat_s)[0])
    proba = bundle.model.predict_proba(feat_s)[0]
    label = LABEL_CLASSES[pred_idx]
    confidence = float(proba[pred_idx])
    probabilities = {cls: float(p) for cls, p in zip(LABEL_CLASSES, proba)}
    recommendations = {
        "Flood Risk": "High flood risk. Avoid low-lying farmland, delay planting, prepare drainage.",
        "Drought Risk": "Drought risk. Conserve water, consider drought-tolerant crops, irrigate if possible.",
        "Normal": "Normal conditions. Standard agricultural practices apply.",
    }
    sms = f"CLISENSE [{state}]: {label.upper()} - {recommendations[label]}"
    return {
        "state": state, "month": month, "prediction": label,
        "confidence": round(confidence, 4), "probabilities": probabilities,
        "recommendation": recommendations[label], "sms": sms,
    }
