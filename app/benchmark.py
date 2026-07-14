"""
benchmark.py - Four-architecture benchmark for the Osogbo / Osun River corridor.

Trains and evaluates Random Forest, XGBoost, Decision Tree and a Multi-Layer
Perceptron, against a naive persistence baseline, on two tasks:
  1. flood classification (binary)
  2. 72-hour land-surface-temperature forecasting (regression)

Data is split chronologically (2016-2021 train, 2022-2023 validation, 2024 test)
to prevent temporal leakage. GridSearchCV with a TimeSeriesSplit is applied to
Random Forest and XGBoost. The champion artefacts and a metrics JSON are written
to models/, and evaluation figures are written to assets/.

Run:  python -m app.benchmark
"""
from __future__ import annotations

import json
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.neural_network import MLPClassifier, MLPRegressor
from sklearn.model_selection import GridSearchCV, TimeSeriesSplit
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, confusion_matrix, mean_squared_error,
                             mean_absolute_error, r2_score)
from xgboost import XGBClassifier, XGBRegressor

from app import model_core as mc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT, "models")
ASSETS_DIR = os.path.join(ROOT, "assets")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(ASSETS_DIR, exist_ok=True)


def flood_metrics(y_true, y_pred):
    return {
        "accuracy": round(100 * accuracy_score(y_true, y_pred), 2),
        "precision": round(100 * precision_score(y_true, y_pred, zero_division=0), 2),
        "recall": round(100 * recall_score(y_true, y_pred, zero_division=0), 2),
        "f1": round(100 * f1_score(y_true, y_pred, zero_division=0), 2),
    }


def temp_metrics(y_true, y_pred):
    err = np.abs(np.asarray(y_true) - np.asarray(y_pred))
    return {
        "rmse": round(float(np.sqrt(mean_squared_error(y_true, y_pred))), 3),
        "mae": round(float(mean_absolute_error(y_true, y_pred)), 3),
        "r2": round(float(r2_score(y_true, y_pred)), 3),
        "acc_within_2c": round(100 * float(np.mean(err <= 2.0)), 2),
    }


def run():
    df = mc.generate_dataset()
    train, val, test = mc.chronological_split(df)
    fit = pd.concat([train, val], ignore_index=True)
    tscv = TimeSeriesSplit(n_splits=4)

    Xf_fit, yf_fit = mc.Xy_flood(fit)
    Xf_te, yf_te = mc.Xy_flood(test)
    Xt_fit, yt_fit = mc.Xy_temp(fit)
    Xt_te, yt_te = mc.Xy_temp(test)

    flood_results, temp_results = {}, {}

    # ---- Flood classification -------------------------------------------------
    # Random Forest (GridSearchCV)
    rf_grid = {"n_estimators": [200, 300, 400], "max_depth": [8, 11, 14],
               "min_samples_leaf": [1, 2]}
    rf_gs = GridSearchCV(RandomForestClassifier(random_state=mc.SEED, n_jobs=-1),
                         rf_grid, cv=tscv, scoring="f1", n_jobs=-1).fit(Xf_fit, yf_fit)
    rf_flood = rf_gs.best_estimator_
    flood_results["Random Forest"] = flood_metrics(yf_te, rf_flood.predict(Xf_te))
    rf_best = rf_gs.best_params_

    # XGBoost (GridSearchCV)
    xgb_grid = {"learning_rate": [0.05, 0.1], "max_depth": [4, 6],
                "subsample": [0.8, 1.0], "n_estimators": [300]}
    xgb_gs = GridSearchCV(XGBClassifier(random_state=mc.SEED, eval_metric="logloss",
                          n_jobs=-1), xgb_grid, cv=tscv, scoring="f1", n_jobs=-1).fit(Xf_fit, yf_fit)
    xgb_flood = xgb_gs.best_estimator_
    flood_results["XGBoost"] = flood_metrics(yf_te, xgb_flood.predict(Xf_te))

    # Decision Tree
    dt_flood = DecisionTreeClassifier(max_depth=10, min_samples_split=10,
                                      random_state=mc.SEED).fit(Xf_fit, yf_fit)
    flood_results["Decision Tree"] = flood_metrics(yf_te, dt_flood.predict(Xf_te))

    # MLP (3 hidden layers, ReLU, Adam, early stopping)
    mlp_flood = MLPClassifier(hidden_layer_sizes=(64, 32, 16), activation="relu",
                              solver="adam", early_stopping=True, max_iter=500,
                              random_state=mc.SEED).fit(Xf_fit, yf_fit)
    flood_results["MLP Neural Network"] = flood_metrics(yf_te, mlp_flood.predict(Xf_te))

    # Naive persistence baseline: today's flood equals the previous day's flood.
    prev = df["flood"].shift(1).to_numpy()
    test_idx = df.index[pd.to_datetime(df["date"]).dt.year >= 2024]
    persist_pred = np.nan_to_num(prev[test_idx], nan=0).astype(int)
    flood_results["Persistence baseline"] = flood_metrics(yf_te, persist_pred)

    # ---- 72-hour temperature regression --------------------------------------
    rf_temp = RandomForestRegressor(**mc.TEMP_RF_PARAMS).fit(Xt_fit, yt_fit)
    temp_results["Random Forest"] = temp_metrics(yt_te, rf_temp.predict(Xt_te))

    xgb_temp = XGBRegressor(n_estimators=300, learning_rate=0.1, max_depth=6,
                            subsample=0.9, random_state=mc.SEED, n_jobs=-1).fit(Xt_fit, yt_fit)
    temp_results["XGBoost"] = temp_metrics(yt_te, xgb_temp.predict(Xt_te))

    dt_temp = DecisionTreeRegressor(max_depth=10, min_samples_split=10,
                                    random_state=mc.SEED).fit(Xt_fit, yt_fit)
    temp_results["Decision Tree"] = temp_metrics(yt_te, dt_temp.predict(Xt_te))

    mlp_temp = MLPRegressor(hidden_layer_sizes=(64, 32, 16), activation="relu",
                            solver="adam", early_stopping=True, max_iter=500,
                            random_state=mc.SEED).fit(Xt_fit, yt_fit)
    temp_results["MLP Neural Network"] = temp_metrics(yt_te, mlp_temp.predict(Xt_te))

    # Temperature persistence: forecast the 72h temperature as today's temperature.
    temp_results["Persistence baseline"] = temp_metrics(yt_te, test["lst_c"].to_numpy())

    # ---- champion selection ---------------------------------------------------
    flood_champ = max(flood_results, key=lambda m: flood_results[m]["f1"])
    temp_champ = max(temp_results, key=lambda m: temp_results[m]["acc_within_2c"])

    # Persist champion artefacts for the API (Random Forest on both tasks).
    joblib.dump(rf_flood, os.path.join(MODELS_DIR, "flood_rf.joblib"))
    joblib.dump(rf_temp, os.path.join(MODELS_DIR, "temp_rf.joblib"))

    # Confusion matrix numbers for the champion flood model.
    cm = confusion_matrix(yf_te, rf_flood.predict(Xf_te))
    tn, fp, fn, tp = int(cm[0, 0]), int(cm[0, 1]), int(cm[1, 0]), int(cm[1, 1])

    metrics = {
        "n_records": int(len(df)),
        "n_train": int(len(train)), "n_val": int(len(val)), "n_test": int(len(test)),
        "flood_rate": round(float(df["flood"].mean()), 4),
        "rf_best_params": rf_best,
        "flood": flood_results, "temperature": temp_results,
        "flood_champion": flood_champ, "temp_champion": temp_champ,
        "confusion": {"tn": tn, "fp": fp, "fn": fn, "tp": tp,
                      "correct": tn + tp, "total": int(cm.sum())},
        "feature_importance": {f: round(float(v), 4) for f, v in
                               zip(mc.FLOOD_FEATURES, rf_flood.feature_importances_)},
    }
    with open(os.path.join(MODELS_DIR, "benchmark_metrics.json"), "w") as fh:
        json.dump(metrics, fh, indent=2)
    make_figures(df, rf_flood, yf_te, rf_flood.predict(Xf_te), metrics)
    return metrics


def make_figures(df, rf_flood, y_true, y_pred, metrics):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    BLUE, AMBER, GREEN, GREY = "#2563eb", "#f59e0b", "#16a34a", "#64748b"

    # Fig 5.1 - confusion matrix (champion flood model)
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(5.2, 4.4))
    im = ax.imshow(cm, cmap="Blues")
    for (i, j), v in np.ndenumerate(cm):
        ax.text(j, i, str(v), ha="center", va="center",
                color="white" if v > cm.max() / 2 else "#1f2937", fontsize=15, fontweight="bold")
    ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
    ax.set_xticklabels(["Normal", "Flood Risk"]); ax.set_yticklabels(["Normal", "Flood Risk"])
    ax.set_xlabel("Predicted"); ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix - Champion Flood Model (2024 test)")
    fig.tight_layout(); fig.savefig(os.path.join(ASSETS_DIR, "fig_confusion_matrix.png"), dpi=150); plt.close(fig)

    # Fig 5.4 - feature importance
    fi = sorted(metrics["feature_importance"].items(), key=lambda kv: kv[1])
    labels = [k for k, _ in fi]; vals = [v * 100 for _, v in fi]
    fig, ax = plt.subplots(figsize=(7.2, 4.6))
    colors = [BLUE if "discharge" in l else GREY for l in labels]
    ax.barh(labels, vals, color=colors)
    for i, v in enumerate(vals):
        ax.text(v + 0.3, i, f"{v:.1f}%", va="center", fontsize=9)
    ax.set_xlabel("Importance (%)")
    ax.set_title("Random Forest Feature Importance - Flood Classification")
    fig.tight_layout(); fig.savefig(os.path.join(ASSETS_DIR, "fig_feature_importance.png"), dpi=150); plt.close(fig)

    # Fig 5.5 - learned seasonal flood risk
    Xall, _ = mc.Xy_flood(df)
    df = df.copy(); df["p"] = rf_flood.predict_proba(Xall)[:, 1]
    monthly = df.groupby("month")["p"].mean() * 100
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    ax.plot(list(monthly.index), monthly.values, marker="o", color=BLUE, linewidth=2)
    ax.fill_between(list(monthly.index), monthly.values, color=BLUE, alpha=0.12)
    ax.set_xticks(range(1, 13)); ax.set_xticklabels(list(mc.MONTH_NAMES.values()))
    ax.set_ylabel("Modelled flood probability (%)")
    ax.set_title("Seasonal Flood Risk in the Osun River Corridor")
    ax.grid(alpha=0.25)
    fig.tight_layout(); fig.savefig(os.path.join(ASSETS_DIR, "fig_seasonal_flood.png"), dpi=150); plt.close(fig)

    # Model comparison bar (flood F1)
    fr = metrics["flood"]
    names = ["Random Forest", "XGBoost", "Decision Tree", "MLP Neural Network", "Persistence baseline"]
    f1s = [fr[n]["f1"] for n in names]
    fig, ax = plt.subplots(figsize=(7.6, 4.2))
    bars = ax.bar(range(len(names)), f1s, color=[GREEN, BLUE, AMBER, "#8b5cf6", GREY])
    for b, v in zip(bars, f1s):
        ax.text(b.get_x() + b.get_width() / 2, v + 0.3, f"{v:.1f}", ha="center", fontsize=9)
    ax.set_xticks(range(len(names)))
    ax.set_xticklabels(["Random\nForest", "XGBoost", "Decision\nTree", "MLP", "Persistence"], fontsize=9)
    ax.set_ylabel("Flood F1-score (%)"); ax.set_ylim(70, 100)
    ax.set_title("Flood Classification - Four-Model Benchmark")
    fig.tight_layout(); fig.savefig(os.path.join(ASSETS_DIR, "fig_model_comparison.png"), dpi=150); plt.close(fig)


if __name__ == "__main__":
    m = run()
    print(json.dumps(m, indent=2))
