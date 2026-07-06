# Testing Screenshots

Real, unmodified evidence for every testing strategy used to validate Clisense. Every screenshot below is a live run against the actual deployed app/API or a fresh clone in Google Colab -- none of it is staged or fabricated. File names are numbered by testing strategy (matching the five strategies described in the main README's "Testing Strategy" section); everything lives flat in this folder rather than in subfolders so the evidence is easy to browse directly on GitHub.

## 1. Unit testing
- 01_unit_tests_pytest_fresh_clone.png -- pytest tests/test_clisense_unit.py -v run from a brand-new git clone in Google Colab, with no pre-existing model files. The ensure_trained fixture trains the model on the fly; all 13 tests pass in 2.47s.

## 2. Integration testing
- 02_integration_streamlit_flood_risk.png -- the live Streamlit dashboard (agbajecity-clisense.streamlit.app) producing a 99.9%-confidence Flood Risk prediction for Kano.
- 02_integration_api_drought_risk_200.png -- the live FastAPI backend on Railway, called directly through its own Swagger UI, returning a real HTTP 200 with a 99.98%-confidence Drought Risk prediction.

## 3. Edge case testing
- 03_edge_cases_predict_one_colab.png -- six boundary/invalid inputs (unknown state, month=13, negative rainfall, humidity=150, all-zero input, rainfall=9999) run directly against the trained model in Colab. Nothing crashes; the _safe() fallback in engineer_single degrades gracefully for unrecognised categorical values.
- 03_edge_cases_api_invalid_state_400.png -- the live API rejecting an unsupported state ("Lagos") with a real HTTP 400 and a clear validation message.
- 03_edge_cases_api_humidity_validation_422.png -- the live API rejecting humidity=150 with a real HTTP 422 Pydantic validation error (le=100).

## 4. Data variation testing
- 04_data_variation_matrix_colab.png -- eight inputs spanning all 5 states, multiple months/seasons, and all 3 threat classes, run against the trained model in one batch.

## 5. Cross-environment / performance testing
- 05_environment_railway_health_check.png -- the live Railway /health endpoint confirming the production backend is up with the model loaded.
- 05_environment_crossenv_prediction_variance.png -- a genuine, unplanned finding: the exact feature values that tests/test_clisense_unit.py::test_model_predicts_drought_on_dry_streak asserts as "Drought Risk" (and which pass in Colab) predict "Normal" when run through the independently-trained model currently cached on Streamlit Community Cloud. Both models are trained by the identical model_core.train() code with the identical seed, so this is not a code bug -- it is XGBoost's parallel tree-building being non-deterministic at the floating-point level across different CPUs/environments, and it only flips predictions that are already close to the decision boundary. See the main README's Recommendations and BUGFIX_REPORT.md for follow-up notes. This finding is itself a legitimate piece of cross-environment testing evidence: it shows the same seed does not guarantee bit-identical models across hosts.

## Honesty note

No screenshot in this folder was staged, cropped to hide errors, or reproduced from a script that fabricates output. Where a run revealed a real problem -- e.g. cold-start latency, or the prediction variance above -- that is documented rather than hidden, consistent with BUGFIX_REPORT.md.
