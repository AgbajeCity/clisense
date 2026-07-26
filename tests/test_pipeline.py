"""Unit tests for the Osogbo / Osun River corridor pipeline."""
import pandas as pd

from app import model_core as mc


def test_dataset_shape():
    df = mc.generate_dataset()
    assert 3200 <= len(df) <= 3300
    for col in mc.FLOOD_FEATURES + ["flood", "date"]:
        assert col in df.columns


def test_flood_is_binary_with_realistic_rate():
    df = mc.generate_dataset()
    assert set(df["flood"].unique()) <= {0, 1}
    assert 0.18 <= df["flood"].mean() <= 0.32


def test_seasonality():
    df = mc.generate_dataset()
    monthly = df.groupby("month")["flood"].mean()
    assert monthly[8] > 0.4 and monthly[9] > 0.4   # wet-season peak
    assert monthly[1] < 0.1 and monthly[2] < 0.1   # dry-season floor


def test_chronological_split_holds_out_2024():
    df = mc.generate_dataset()
    train, val, test = mc.chronological_split(df)
    assert pd.to_datetime(train["date"]).dt.year.max() <= 2021
    assert pd.to_datetime(val["date"]).dt.year.min() >= 2022
    assert pd.to_datetime(test["date"]).dt.year.min() >= 2024
    assert len(test) == 366


def test_predict_distinguishes_flood_from_normal():
    """Input values are grounded in the real dataset's actual Aug/Sep flood-day
    and Jan normal-day distributions (see data/real_climate_osogbo_2016_2024.csv
    -> generate_dataset()), not made-up round numbers - the real rainfall-runoff
    coupling means discharge and rain_30d must be internally consistent for the
    model to recognize the scenario the way it learned to from training data."""
    bundle = mc.train_champion()
    flood = mc.predict_one(bundle, month=8, rainfall_mm=15, rain_30d=280, discharge_m3s=170)
    dry = mc.predict_one(bundle, month=1, rainfall_mm=0, rain_30d=3, discharge_m3s=13)
    assert flood["flood_class"] == "Flood Risk"
    assert dry["flood_class"] == "Normal"
    assert flood["flood_probability"] > dry["flood_probability"]
    for key in ("flood_class", "flood_probability",
                "recommendation", "community", "month_name"):
        assert key in flood


def test_champion_models_ready():
    bundle = mc.train_champion()
    assert hasattr(bundle["flood_model"], "predict_proba")
    assert bundle["flood_model"].n_features_in_ == len(mc.FLOOD_FEATURES)
