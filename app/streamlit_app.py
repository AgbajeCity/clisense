"""
Clisense - Climate Intelligence Dashboard
Streamlit MVP for ALU Mission Capstone 2026

All feature engineering, data generation, training, and prediction logic
lives in app/model_core.py. This file is presentation only.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

import model_core as mc

st.set_page_config(
    page_title="Clisense - Climate Intelligence",
    page_icon="\U0001F324",
    layout="wide",
    initial_sidebar_state="expanded",
)

MONTH_NAMES = {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
               7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"}


@st.cache_data
def get_dataset():
    return mc.generate_synthetic_dataset()


@st.cache_resource
def get_trained_bundle_and_metrics():
    """Train once per app process and cache both the model and the REAL
    metrics computed from that run (no hardcoded numbers)."""
    df = get_dataset()
    bundle, metrics, _ = mc.train(df)
    mc.save_bundle(bundle, metrics)
    return bundle, metrics


st.sidebar.title("\U0001F324 Clisense")
st.sidebar.markdown("**Climate Intelligence for Farmers**")
st.sidebar.markdown("---")
tab_sel = st.sidebar.radio(
    "Navigation",
    ["\U0001F3AF Prediction", "\U0001F4CA Data Explorer", "\U0001F4C8 Model Performance", "\u2139\uFE0F About"],
)

if tab_sel == "\U0001F3AF Prediction":
    st.title("\U0001F324 Clisense - Climate Intelligence")
    st.markdown("### \U0001F3AF Climate Threat Prediction")
    col1, col2 = st.columns(2)
    with col1:
        state = st.selectbox("State", mc.STATES)
        month = st.slider("Month", 1, 12, 8, format="%d")
        st.caption(f"Month: {MONTH_NAMES[month]}")
        rainfall_mm = st.number_input("Daily Rainfall (mm)", 0.0, 500.0, 48.0, 0.1)
        temp_c = st.number_input("Temperature (C)", 10.0, 50.0, 27.0, 0.1)
    with col2:
        humidity_pct = st.number_input("Humidity (%)", 10.0, 100.0, 88.0, 0.1)
        rain_7d = st.number_input("7-Day Total Rainfall (mm)", 0.0, 2000.0, 180.0, 0.1)
        rain_30d = st.number_input("30-Day Total Rainfall (mm)", 0.0, 5000.0, 620.0, 0.1)

    if st.button("\U0001F50D Run Prediction", type="primary"):
        with st.spinner("Analyzing climate conditions..."):
            bundle, _ = get_trained_bundle_and_metrics()
            result = mc.predict_one(
                bundle, state, month, rainfall_mm, temp_c, humidity_pct, rain_7d, rain_30d
            )
        label = result["prediction"]
        emoji = "\U0001F30A" if label == "Flood Risk" else "\U0001F3DC\uFE0F" if label == "Drought Risk" else "\u2705"
        color = "\U0001F534" if label in ["Flood Risk", "Drought Risk"] else "\U0001F7E2"
        st.markdown(f"## {color} {emoji} **{label}**")
        st.metric("Confidence", f"{result['confidence']*100:.1f}%")
        st.markdown("### Probability Breakdown")
        for cls, prob in result["probabilities"].items():
            st.progress(prob, text=f"{cls}: {prob*100:.1f}%")

        if label == "Flood Risk":
            st.warning(f"\u26A0\uFE0F **Flood Risk Detected** - {result['recommendation']}")
        elif label == "Drought Risk":
            st.warning(f"\u26A0\uFE0F **Drought Risk Detected** - {result['recommendation']}")
        else:
            st.success(f"\u2705 **Conditions Normal** - {result['recommendation']}")

        st.markdown("### SMS Alert Preview")
        st.code(result["sms"], language=None)

elif tab_sel == "\U0001F4CA Data Explorer":
    st.title("\U0001F4CA Data Explorer")
    df = get_dataset()
    st.write(f"Dataset: {len(df):,} synthetic records across {df['state'].nunique()} Nigerian states (generated from climatological normals, see README Limitations)")

    col1, col2 = st.columns(2)
    with col1:
        fig, ax = plt.subplots(figsize=(8, 4))
        for state in mc.STATES:
            state_df = df[df["state"] == state].groupby("month")["rainfall_mm"].mean()
            ax.plot(state_df.index, state_df.values, label=state, marker="o", markersize=3)
        ax.set_xlabel("Month"); ax.set_ylabel("Avg Rainfall (mm)")
        ax.set_title("Monthly Rainfall Trends by State")
        ax.legend(fontsize=8); ax.grid(alpha=0.3)
        st.pyplot(fig); plt.close()

    with col2:
        fig, ax = plt.subplots(figsize=(8, 4))
        threat_counts = df["threat_label"].value_counts()
        colors = ["#4CAF50", "#FF9800", "#2196F3"]
        ax.pie(threat_counts.values, labels=threat_counts.index, autopct="%1.1f%%",
               colors=colors[:len(threat_counts)])
        ax.set_title("Threat Label Distribution")
        st.pyplot(fig); plt.close()

    st.subheader("Seasonal Threat Heatmap")
    pivot = df.groupby(["month", "threat_label"]).size().unstack(fill_value=0)
    fig, ax = plt.subplots(figsize=(10, 4))
    sns.heatmap(pivot.T, ax=ax, cmap="YlOrRd", annot=True, fmt="d", cbar_kws={"label": "Count"})
    ax.set_xlabel("Month"); ax.set_ylabel("Threat")
    ax.set_title("Seasonal Threat Distribution")
    st.pyplot(fig); plt.close()

    st.subheader("Raw Data Sample")
    st.dataframe(df.sample(min(200, len(df)), random_state=1), use_container_width=True)

elif tab_sel == "\U0001F4C8 Model Performance":
    st.title("\U0001F4C8 Model Performance")
    st.caption("These numbers are computed live from a real held-out test split each time this app starts. They are not hardcoded.")

    bundle, metrics = get_trained_bundle_and_metrics()

    cols = st.columns(4)
    cols[0].metric("Algorithm", metrics["algorithm"])
    cols[1].metric("Test Accuracy", f"{metrics['accuracy']*100:.2f}%")
    cols[2].metric("Weighted F1", f"{metrics['weighted_f1']:.4f}")
    cols[3].metric("5-Fold CV F1", f"{metrics['cv_f1_mean']:.4f} (+/- {metrics['cv_f1_std']:.4f})")

    st.markdown(f"Trained on **{metrics['n_samples']:,}** records ({metrics['n_train']:,} train / {metrics['n_test']:,} test).")

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Confusion Matrix (test set)")
        cm = np.array(metrics["confusion_matrix"])
        fig, ax = plt.subplots(figsize=(6, 5))
        sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                    xticklabels=mc.LABEL_CLASSES, yticklabels=mc.LABEL_CLASSES)
        ax.set_xlabel("Predicted"); ax.set_ylabel("True")
        ax.set_title("Confusion Matrix")
        st.pyplot(fig); plt.close()

    with col2:
        st.subheader("Feature Importance")
        importances = metrics["feature_importances"]
        names = list(importances.keys())
        values = list(importances.values())
        idx = np.argsort(values)[-10:]
        fig, ax = plt.subplots(figsize=(6, 5))
        ax.barh([names[i] for i in idx], [values[i] for i in idx], color="steelblue")
        ax.set_xlabel("Importance Score")
        ax.set_title("Top 10 Feature Importance")
        ax.grid(axis="x", alpha=0.3)
        st.pyplot(fig); plt.close()

    st.subheader("Per-Class Report")
    st.json(metrics["classification_report"])

elif tab_sel == "\u2139\uFE0F About":
    st.title("\u2139\uFE0F About Clisense")
    _, metrics = get_trained_bundle_and_metrics()
    st.markdown(f"""
## Clisense - ML-Powered Predictive Climate Intelligence

**Track**: Machine Learning | **Program**: ALU BSc Software Engineering, Cohort 14
**Student**: H. Ayomide Agbaje | **Supervisor**: Ndinelao Iitumba

### Project Overview
Clisense is an AI-powered early warning system designed to help smallholder farmers in rural Nigeria
make informed agricultural decisions based on climate threat predictions. The system classifies climate
conditions into three categories:
- **Normal** - Safe conditions for standard farming
- **Drought Risk** - Water scarcity conditions requiring conservation measures
- **Flood Risk** - Excessive rainfall conditions requiring protective action

### Model Architecture
- **Algorithm**: {metrics['algorithm']}
- **Training data**: {metrics['n_samples']:,} synthetic daily climate records generated from climatological normals (2015-2024)
- **Coverage**: 5 Nigerian agricultural states (Kano, Kaduna, Benue, Niger, Plateau)
- **Features**: {len(mc.FEATURE_NAMES)} engineered features including rainfall statistics, temperature, humidity, and cyclical time encodings

### Performance Metrics (live, this run)
| Metric | Score |
|--------|-------|
| Accuracy | {metrics['accuracy']*100:.2f}% |
| F1-Score (weighted) | {metrics['weighted_f1']:.4f} |
| Recall (weighted) | {metrics['weighted_recall']:.4f} |
| 5-Fold CV Mean F1 | {metrics['cv_f1_mean']:.4f} |

### Known Limitation
Training data is synthetic, generated from climatological normals rather than live sensor/satellite
feeds. See the README 'Limitations' section for full disclosure and the production roadmap.

### GitHub Repository
[https://github.com/AgbajeCity/clisense](https://github.com/AgbajeCity/clisense)
""")
