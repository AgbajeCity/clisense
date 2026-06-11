# Clisense — Video Demo Script
## ALU Mission Capstone 2026 | H. Ayomide Agbaje

**Target Duration:** 7 minutes  
**Format:** Screen recording with narration  
**Tool:** Loom (recommended)

---

## Pre-Recording Checklist

- [ ] Open Streamlit app: https://agbajecity-clisense.streamlit.app
- [ ] Open FastAPI docs: https://clisense-production.up.railway.app/docs
- [ ] Open GitHub repo: https://github.com/AgbajeCity/clisense
- [ ] Close all irrelevant browser tabs
- [ ] Test microphone and screen capture
- [ ] Prepare sample inputs (Benue August, Kano June)

---

## Script Outline

### [0:00 – 0:30] Introduction
"Hello, my name is Ayomide Agbaje, and this is Clisense — a Machine Learning-powered Predictive Climate Intelligence and Early Warning System for smallholder farmers in rural Nigeria. This is my ALU Mission Capstone 2026 project."

### [0:30 – 1:30] Problem Statement
"Over 70% of Nigeria's food supply depends on smallholder farmers who have no reliable access to climate forecasting. Floods in Benue and droughts in Kano cost thousands of livelihoods each year. Clisense changes that."

### [1:30 – 3:30] Live Demo — Prediction Tab
- Navigate to the Prediction tab
- Input: State = Benue, Month = August, Rainfall = 280mm, Temp = 29°C, Humidity = 85%
- "Notice the model predicts Flood Risk with over 85% confidence — and provides an actionable recommendation for the farmer."
- Input: State = Kano, Month = June, Rainfall = 40mm, Temp = 38°C, Humidity = 30%
- "For Kano in June, the model correctly identifies Drought Risk."

### [3:30 – 4:30] Data Explorer Tab
- Show the historical climate data visualization
- "The system is trained on 10 years of historical climate data across all 36 Nigerian states."

### [4:30 – 5:30] Model Performance Tab
- Show accuracy metrics, confusion matrix
- "Our Gradient Boosting model achieves 92% accuracy across 4 climate risk classes."

### [5:30 – 6:00] API Demo
- Navigate to FastAPI /docs
- Show the /predict endpoint
- Execute a test call
- "Clisense also exposes a REST API for integration with SMS gateways and mobile apps used by extension workers."

### [6:00 – 6:30] GitHub & Architecture
- Show GitHub repo structure
- "The full source code is open on GitHub. The architecture follows a clean separation between the ML pipeline, the Streamlit frontend, and the FastAPI backend."

### [6:30 – 7:00] Closing
"Clisense represents a practical, deployable solution for climate risk early warning in Nigeria. Thank you for watching — I'm Ayomide Agbaje, ALU Cohort 14, Machine Learning track."

---

## Sample Test Inputs

| Scenario | State | Month | Rainfall (mm) | Temp (°C) | Humidity (%) | Expected |
|----------|-------|-------|---------------|-----------|--------------|----------|
| Flood Risk | Benue | August | 280 | 29 | 85 | Flood Risk |
| Drought Risk | Kano | June | 40 | 38 | 30 | Drought Risk |
| Normal | Lagos | April | 120 | 28 | 70 | Normal |
| Moderate | Enugu | July | 160 | 26 | 75 | Moderate Risk |

---

*Generated for ALU Mission Capstone 2026 — Clisense Project*
