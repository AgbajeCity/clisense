"""
Unit tests for Clisense core prediction logic and preprocessing pipeline.
Run: pytest tests/test_clisense_unit.py -v

Note: this suite is self-contained and reproducible from a fresh clone.
The 'ensure_trained' autouse fixture below trains and saves the model
(via app/model_core.load_or_train()) the first time the suite runs if
models/*.pkl are not already present -- you do NOT need to run the app
or the notebook first.
"""

import sys
import pytest
import numpy as np
import joblib
import json
from pathlib import Path

BASE = Path(__file__).parent.parent
sys.path.insert(0, str(BASE / "app"))

import model_core as mc  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def ensure_trained():
    """Guarantee models/*.pkl exist before any test runs, without requiring
    the app or notebook to have been run first."""
    if not (BASE / "models" / "clisense_xgb_model.pkl").exists():
        mc.load_or_train()
    yield


@pytest.fixture(scope="module")
def model():
    return joblib.load(BASE / "models" / "clisense_xgb_model.pkl")


@pytest.fixture(scope="module")
def scaler():
    return joblib.load(BASE / "models" / "clisense_scaler.pkl")


@pytest.fixture(scope="module")
def le_state():
    return joblib.load(BASE / "models" / "clisense_le_state.pkl")


@pytest.fixture(scope="module")
def le_season():
    return joblib.load(BASE / "models" / "clisense_le_season.pkl")


@pytest.fixture(scope="module")
def le_zone():
    return joblib.load(BASE / "models" / "clisense_le_zone.pkl")


@pytest.fixture(scope="module")
def feature_meta():
    with open(BASE / "models" / "features.json") as f:
        return json.load(f)


# ---- Feature metadata tests ----

def test_feature_count_is_sixteen(feature_meta):
    """Model expects exactly 16 features."""
    assert len(feature_meta["features"]) == 16


def test_class_labels_are_correct(feature_meta):
    """Classes must be 0=Normal, 1=Drought Risk, 2=Flood Risk."""
    assert feature_meta["classes"]["0"] == "Normal"
    assert feature_meta["classes"]["1"] == "Drought Risk"
    assert feature_meta["classes"]["2"] == "Flood Risk"


def test_supported_states(feature_meta):
    """All five Nigerian target states must be present."""
    expected = {"Benue", "Kaduna", "Kano", "Niger", "Plateau"}
    assert expected.issubset(set(feature_meta["states"]))


# ---- Scaler tests ----

def test_scaler_output_shape(scaler):
    dummy = np.zeros((1, 16))
    out = scaler.transform(dummy)
    assert out.shape == (1, 16)


def test_scaler_produces_finite_values(scaler):
    dummy = np.array([[5.0, 28.0, 60.0, 2.5, 35.0, 120.0,
                        28.0, 1.2, 0.0, 0.5, 0.86, 0.5, 0.86,
                        1.0, 1.0, 1.0]])
    out = scaler.transform(dummy)
    assert np.all(np.isfinite(out))


# ---- Encoder tests ----

def test_state_encoder_known_state(le_state):
    enc = le_state.transform(["Kano"])
    assert isinstance(enc[0], (int, np.integer))


def test_state_encoder_all_five_states(le_state):
    states = ["Benue", "Kaduna", "Kano", "Niger", "Plateau"]
    encoded = le_state.transform(states)
    assert len(set(encoded)) == 5


def test_season_encoder_wet_dry(le_season):
    enc = le_season.transform(["wet", "dry"])
    assert enc[0] != enc[1]


# ---- Model output tests ----

def test_model_returns_single_class(model, scaler):
    feat = np.zeros((1, 16))
    pred = model.predict(scaler.transform(feat))
    assert pred.shape == (1,)
    assert pred[0] in [0, 1, 2]


def test_model_probabilities_sum_to_one(model, scaler):
    feat = np.zeros((1, 16))
    probs = model.predict_proba(scaler.transform(feat))
    assert abs(probs[0].sum() - 1.0) < 1e-5


def test_model_predicts_flood_on_extreme_rain(model, scaler, le_state, le_season, le_zone):
    """High 7-day and 30-day rainfall in Benue during wet season should trigger flood."""
    state_enc = le_state.transform(["Benue"])[0]
    season_enc = le_season.transform(["wet"])[0]
    zone_enc = le_zone.transform(["Southern Guinea Savanna"])[0]
    feat = np.array([[60.0, 27.0, 90.0, 2.5,
                       220.0, 750.0, 27.0,
                       45.0, 0.0,
                       0.5, 0.86, 0.5, 0.86,
                       state_enc, season_enc, zone_enc]])
    pred = model.predict(scaler.transform(feat))
    assert pred[0] == 2, f"Expected Flood Risk (2), got {pred[0]}"


def test_model_predicts_drought_on_dry_streak(model, scaler, le_state, le_season, le_zone):
    """Near-zero rainfall over 30 days in Kano during wet season should trigger drought."""
    state_enc = le_state.transform(["Kano"])[0]
    season_enc = le_season.transform(["wet"])[0]
    zone_enc = le_zone.transform(["Sudan Savanna"])[0]
    feat = np.array([[0.1, 33.0, 25.0, 3.0,
                       0.5, 8.0, 33.0,
                       -18.0, 25.0,
                       0.5, 0.86, 0.5, 0.86,
                       state_enc, season_enc, zone_enc]])
    pred = model.predict(scaler.transform(feat))
    assert pred[0] == 1, f"Expected Drought Risk (1), got {pred[0]}"


def test_model_predicts_normal_on_typical_values(model, scaler, le_state, le_season, le_zone):
    """Average mid-wet-season values for Kaduna should return Normal."""
    state_enc = le_state.transform(["Kaduna"])[0]
    season_enc = le_season.transform(["wet"])[0]
    zone_enc = le_zone.transform(["Northern Guinea Savanna"])[0]
    feat = np.array([[8.0, 26.5, 68.0, 2.0,
                       55.0, 195.0, 26.5,
                       1.2, 0.0,
                       0.5, 0.86, 0.5, 0.86,
                       state_enc, season_enc, zone_enc]])
    pred = model.predict(scaler.transform(feat))
    assert pred[0] == 0, f"Expected Normal (0), got {pred[0]}"
