"""
model_core.py - Clisense (Osun River Corridor Pilot: Osogbo, Osun State)

Single source of truth for the capstone pipeline:
  * synthetic dataset generation for the Osogbo / Osun River flood corridor
  * feature engineering (river-discharge lags, rolling rainfall, coupled soil
    moisture and vegetation index, autocorrelated land-surface temperature)
  * the champion Random Forest models (flood classification + 72-hour temperature)
  * a single-record prediction used by the FastAPI service and the browser interface

DISCLOSED SYNTHETIC DATA. Live CHIRPS, MODIS, NIHSA and CliNode feeds were not
accessible in the development environment, so a daily dataset was generated
programmatically to reflect the corridor's published hydrology and climatology
(wet-season discharge peak of ~150 m3/s in Aug-Sep at the Osogbo gauge;
Ogundolie et al., 2024). Every figure here is generated, not measured.
"""
from __future__ import annotations

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

SEED = 42
COMMUNITY = "Osogbo"
STATE = "Osun"
START_DATE = "2016-01-01"
END_DATE = "2024-12-31"

MONTH_NAMES = {
    1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
    7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
}

# Features consumed by the flood classifier
FLOOD_FEATURES = [
    "month_sin", "month_cos", "rainfall_mm", "rain_7d", "rain_30d",
    "discharge_m3s", "discharge_lag1", "discharge_lag3",
    "soil_moisture", "veg_index",
]

# Features consumed by the 72-hour temperature regressor
TEMP_FEATURES = [
    "month_sin", "month_cos", "lst_c", "lst_lag1",
    "rainfall_mm", "rain_7d", "discharge_m3s", "soil_moisture",
]

FLOOD_CLASSES = ["Normal", "Flood Risk"]


def generate_dataset(seed: int = SEED) -> pd.DataFrame:
    """Generate the disclosed synthetic daily dataset for the Osogbo corridor.

    2016-01-01 to 2024-12-31, one row per day. The seasonal structure is anchored
    to late-August rainfall and an Aug-Sep discharge peak of ~150 m3/s.
    """
    rng = np.random.default_rng(seed)
    dates = pd.date_range(START_DATE, END_DATE, freq="D")
    n = len(dates)
    doy = dates.dayofyear.to_numpy()
    month = dates.month.to_numpy()

    # Seasonal wet-season envelope, peaking in late August (day-of-year ~240).
    rain_season = np.exp(-0.5 * ((doy - 240) / 45.0) ** 2)

    # Same-day rainfall (mm): near zero in the dry season, heavy and skewed in
    # the wet season. Gamma keeps it non-negative and right-skewed like real rain.
    rain_mean = 0.4 + 15.0 * rain_season
    rainfall = rng.gamma(shape=0.65, scale=rain_mean / 0.65)
    rainfall = np.round(np.clip(rainfall, 0.0, None), 2)

    rs = pd.Series(rainfall)
    rain_7d = rs.rolling(7, min_periods=1).sum().to_numpy()
    rain_30d = rs.rolling(30, min_periods=1).sum().to_numpy()

    # River discharge (m3/s): autocorrelated day to day, seasonal peak ~150 in
    # early September (doy ~250), lifted further by recent cumulative rainfall.
    disch_season = 8.0 + 142.0 * np.exp(-0.5 * ((doy - 250) / 38.0) ** 2)
    discharge = np.empty(n)
    discharge[0] = disch_season[0]
    phi_q = 0.85  # persistence
    for i in range(1, n):
        target = disch_season[i] + 0.12 * rain_30d[i]
        discharge[i] = phi_q * discharge[i - 1] + (1 - phi_q) * target + rng.normal(0, 4.0)
    discharge = np.round(np.clip(discharge, 2.0, None), 2)
    discharge_lag1 = pd.Series(discharge).shift(1).to_numpy()
    discharge_lag3 = pd.Series(discharge).shift(3).to_numpy()

    # Land surface temperature (C): autocorrelated around a seasonal mean. The
    # dry season runs warmer (~28-30 C); the cloudy wet season runs cooler.
    lst_season = 28.0 - 2.5 * rain_season + 1.2 * np.cos(2 * np.pi * (doy - 30) / 365.0)
    lst = np.empty(n)
    lst[0] = lst_season[0]
    phi_t = 0.75
    for i in range(1, n):
        lst[i] = phi_t * lst[i - 1] + (1 - phi_t) * lst_season[i] + rng.normal(0, 0.8)
    lst = np.round(lst, 2)
    lst_lag1 = pd.Series(lst).shift(1).to_numpy()

    # Soil moisture and vegetation index proxy, both coupled to 30-day rainfall.
    soil_moisture = np.clip(0.15 + 0.00090 * rain_30d + rng.normal(0, 0.02, n), 0, 1)
    veg_index = np.clip(0.25 + 0.00060 * rain_30d + rng.normal(0, 0.03, n), 0, 1)

    month_sin = np.sin(2 * np.pi * month / 12.0)
    month_cos = np.cos(2 * np.pi * month / 12.0)

    df = pd.DataFrame({
        "date": dates, "month": month, "doy": doy,
        "month_sin": month_sin, "month_cos": month_cos,
        "rainfall_mm": rainfall, "rain_7d": np.round(rain_7d, 2), "rain_30d": np.round(rain_30d, 2),
        "discharge_m3s": discharge, "discharge_lag1": discharge_lag1, "discharge_lag3": discharge_lag3,
        "lst_c": lst, "lst_lag1": lst_lag1,
        "soil_moisture": np.round(soil_moisture, 4), "veg_index": np.round(veg_index, 4),
    })

    # 72-hour temperature target: the land surface temperature three days ahead.
    df["temp_72h"] = pd.Series(lst).shift(-3).to_numpy()

    # Flood label as a discrete event driven by discharge and recent rainfall,
    # with noise so even peak-season days are only intermittently at risk. The
    # intercept is calibrated to a realistic corridor flood rate (~26%).
    risk = ((discharge - 88.0) / 24.0) + ((rain_7d - 120.0) / 60.0) + rng.normal(0, 0.55, n)
    prob = 1.0 / (1.0 + np.exp(-risk))
    df["flood"] = (rng.random(n) < prob).astype(int)

    # Drop rows without full lag/target context (first 3 and last 3 days).
    df = df.dropna().reset_index(drop=True)
    return df


def chronological_split(df: pd.DataFrame):
    """Split by calendar year to prevent temporal leakage (proposal 70/15/15).

    Train: 2016-2021, Validation: 2022-2023, Test (held out): 2024.
    """
    year = pd.to_datetime(df["date"]).dt.year
    train = df[year <= 2021].reset_index(drop=True)
    val = df[(year >= 2022) & (year <= 2023)].reset_index(drop=True)
    test = df[year >= 2024].reset_index(drop=True)
    return train, val, test


def Xy_flood(df: pd.DataFrame):
    return df[FLOOD_FEATURES].to_numpy(), df["flood"].to_numpy()


def Xy_temp(df: pd.DataFrame):
    return df[TEMP_FEATURES].to_numpy(), df["temp_72h"].to_numpy()


# Champion hyperparameters (selected by GridSearchCV in benchmark.py and pinned
# here so the deployed service trains deterministically without a runtime search).
FLOOD_RF_PARAMS = dict(n_estimators=400, max_depth=8, min_samples_leaf=2,
                       n_jobs=-1, random_state=SEED)
TEMP_RF_PARAMS = dict(n_estimators=300, max_depth=14, min_samples_leaf=2,
                      n_jobs=-1, random_state=SEED)


def train_champion(df: pd.DataFrame | None = None):
    """Train both champion Random Forest models on the train+validation span.

    Returns a bundle dict consumed by predict_one() and the API.
    """
    if df is None:
        df = generate_dataset()
    train, val, test = chronological_split(df)
    fit_df = pd.concat([train, val], ignore_index=True)

    Xf, yf = Xy_flood(fit_df)
    flood_model = RandomForestClassifier(**FLOOD_RF_PARAMS).fit(Xf, yf)

    Xt, yt = Xy_temp(fit_df)
    temp_model = RandomForestRegressor(**TEMP_RF_PARAMS).fit(Xt, yt)

    return {"flood_model": flood_model, "temp_model": temp_model,
            "flood_rate": float(df["flood"].mean()), "n_records": int(len(df))}


def _seasonal_lst(month: int) -> float:
    """Climatological land-surface temperature for the middle of a given month,
    using the same seasonal shape as the generator. Used to fill the temperature
    model's context when only summary inputs are supplied at prediction time."""
    doy = int((month - 0.5) * 30.4)
    rain_season = float(np.exp(-0.5 * ((doy - 240) / 45.0) ** 2))
    return 28.0 - 2.5 * rain_season + 1.2 * float(np.cos(2 * np.pi * (doy - 30) / 365.0))


def build_features(month: int, rainfall_mm: float, rain_30d: float,
                   discharge_m3s: float, rain_7d: float | None = None,
                   discharge_lag1: float | None = None,
                   discharge_lag3: float | None = None):
    """Turn the interface's summary inputs into the full model feature vectors.

    Derived quantities (disclosed): 7-day rainfall defaults to a share of the
    30-day total but never less than same-day rainfall; discharge lags default
    to the current discharge (a steady-state assumption); soil moisture and the
    vegetation index reuse the generator's rainfall coupling; temperature context
    comes from the monthly climatology above.
    """
    if rain_7d is None:
        rain_7d = max(rainfall_mm, 0.35 * rain_30d)
    if discharge_lag1 is None:
        discharge_lag1 = discharge_m3s
    if discharge_lag3 is None:
        discharge_lag3 = discharge_m3s
    soil_moisture = float(np.clip(0.15 + 0.00090 * rain_30d, 0, 1))
    veg_index = float(np.clip(0.25 + 0.00060 * rain_30d, 0, 1))
    lst_c = _seasonal_lst(month)
    month_sin = float(np.sin(2 * np.pi * month / 12.0))
    month_cos = float(np.cos(2 * np.pi * month / 12.0))

    flood_vec = [[month_sin, month_cos, rainfall_mm, rain_7d, rain_30d,
                  discharge_m3s, discharge_lag1, discharge_lag3, soil_moisture, veg_index]]
    temp_vec = [[month_sin, month_cos, lst_c, lst_c, rainfall_mm, rain_7d,
                 discharge_m3s, soil_moisture]]
    return flood_vec, temp_vec


def _recommendation(flood: bool) -> str:
    if flood:
        return ("High flood risk in the Osun River corridor. Move stored harvest to higher "
                "ground, hold off planting in low-lying plots, and clear field drainage.")
    return ("Conditions normal. Continue standard practices and monitor river levels through "
            "the Aug-Sep peak.")


def predict_one(bundle, month: int, rainfall_mm: float, rain_30d: float,
                discharge_m3s: float, rain_7d: float | None = None,
                discharge_lag1: float | None = None,
                discharge_lag3: float | None = None) -> dict:
    """Return a flood classification, flood probability and 72-hour temperature."""
    flood_vec, temp_vec = build_features(month, rainfall_mm, rain_30d, discharge_m3s,
                                         rain_7d, discharge_lag1, discharge_lag3)
    prob = float(bundle["flood_model"].predict_proba(flood_vec)[0][1])
    is_flood = prob >= 0.5
    temp_72h = float(bundle["temp_model"].predict(temp_vec)[0])
    return {
        "community": COMMUNITY,
        "state": STATE,
        "month": int(month),
        "month_name": MONTH_NAMES.get(int(month), str(month)),
        "flood_class": "Flood Risk" if is_flood else "Normal",
        "flood_probability": round(prob, 4),
        "temperature_72h_c": round(temp_72h, 2),
        "recommendation": _recommendation(is_flood),
    }
