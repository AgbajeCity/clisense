"""API-level integration and edge-case tests for the FastAPI service (app/api.py).

tests/test_pipeline.py covers model_core.py in isolation (dataset generation,
features, the trained models). This file covers the HTTP surface the slides and
README describe as tested - the request -> validation -> model -> response path,
plus the boundary/invalid-input cases documented in the capstone report but not
previously present anywhere in the repository as runnable tests.
"""
from fastapi.testclient import TestClient

from app.api import app
from app import model_core as mc

client = TestClient(app)


# ---- /health ----------------------------------------------------------------

def test_health_reports_ready_model():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "healthy"
    assert body["loaded"] is True
    assert body["community"] == "Osogbo"
    assert body["state"] == "Osun"
    assert body["tasks"] == ["flood_classification"]


# ---- /predict: integration (happy path) --------------------------------------

def test_predict_peak_season_returns_flood_risk():
    """Values are grounded in the real Osogbo Aug/Sep flood-day distribution
    (see tests/test_pipeline.py::test_predict_distinguishes_flood_from_normal
    for how these were derived from the real dataset)."""
    r = client.post("/predict", json={
        "community": "Osogbo", "month": 8,
        "rainfall_mm": 15, "rain_30d": 280, "discharge_m3s": 170,
    })
    assert r.status_code == 200
    body = r.json()
    assert body["flood_class"] == "Flood Risk"
    assert 0.0 <= body["flood_probability"] <= 1.0
    assert body["recommendation"]
    assert body["month_name"] == "Aug"


def test_predict_dry_season_returns_normal():
    r = client.post("/predict", json={
        "community": "Osogbo", "month": 1,
        "rainfall_mm": 0, "rain_30d": 3, "discharge_m3s": 13,
    })
    assert r.status_code == 200
    assert r.json()["flood_class"] == "Normal"


# ---- /predict: scope + validation edge cases ----------------------------------

def test_predict_rejects_community_outside_pilot_scope():
    r = client.post("/predict", json={
        "community": "Lagos", "month": 8,
        "rainfall_mm": 45, "rain_30d": 620, "discharge_m3s": 142,
    })
    assert r.status_code == 400
    assert "Osogbo" in r.json()["detail"]


def test_predict_community_match_is_case_insensitive():
    r = client.post("/predict", json={
        "community": "  osogbo  ", "month": 8,
        "rainfall_mm": 45, "rain_30d": 620, "discharge_m3s": 142,
    })
    assert r.status_code == 200


def test_predict_rejects_month_out_of_range():
    r = client.post("/predict", json={
        "community": "Osogbo", "month": 13,
        "rainfall_mm": 45, "rain_30d": 620, "discharge_m3s": 142,
    })
    assert r.status_code == 422


def test_predict_rejects_negative_rainfall():
    r = client.post("/predict", json={
        "community": "Osogbo", "month": 8,
        "rainfall_mm": -5, "rain_30d": 620, "discharge_m3s": 142,
    })
    assert r.status_code == 422


def test_predict_rejects_negative_discharge():
    r = client.post("/predict", json={
        "community": "Osogbo", "month": 8,
        "rainfall_mm": 10, "rain_30d": 100, "discharge_m3s": -1,
    })
    assert r.status_code == 422


def test_predict_rejects_missing_required_field():
    r = client.post("/predict", json={"community": "Osogbo", "month": 8})
    assert r.status_code == 422


def test_predict_accepts_zero_rainfall_and_discharge():
    """All-zero input is a legitimate boundary case (extreme dry spell), not
    an error - the model should score it as low flood risk, not crash."""
    r = client.post("/predict", json={
        "community": "Osogbo", "month": 3,
        "rainfall_mm": 0, "rain_30d": 0, "discharge_m3s": 0,
    })
    assert r.status_code == 200
    assert r.json()["flood_class"] == "Normal"


# ---- /benchmark ---------------------------------------------------------------

def test_benchmark_exposes_all_four_models_and_baseline():
    r = client.get("/benchmark")
    assert r.status_code == 200
    body = r.json()
    expected = {"Random Forest", "XGBoost", "Decision Tree",
                "MLP Neural Network", "Persistence baseline"}
    assert set(body["flood"].keys()) == expected
    # Checked against the pinned constant, not a hardcoded name, since which
    # architecture wins is a property of the (real) data, not a fixed assumption.
    assert body["flood_champion"] == mc.CHAMPION_FLOOD_MODEL


def test_benchmark_champion_matches_served_model():
    """The model /predict actually serves must be the one /benchmark and
    /health both call the champion - see the guardrail added in
    app/benchmark.py that fails the build if this ever drifts apart."""
    bench = client.get("/benchmark").json()
    health = client.get("/health").json()
    assert bench["flood_champion"] in health["model"]


# ---- / (browser interface) -----------------------------------------------------

def test_root_serves_the_dashboard_html():
    r = client.get("/")
    assert r.status_code == 200
    assert "text/html" in r.headers["content-type"]
    assert "Osun River Corridor" in r.text
