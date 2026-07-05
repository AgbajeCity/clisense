# Testing Screenshots

This folder holds the evidence for all testing strategies used to validate Clisense, referenced in the main README and required by the capstone assignment rubric.

## Folder structure and what belongs in each
- `01_unit_tests/` - Terminal output from pytest tests/test_clisense_unit.py -v, showing all 14 unit tests for the prediction logic, scaler, and encoders passing.
- - `02_integration_tests/` - End-to-end screenshots of the Streamlit dashboard and FastAPI Swagger UI producing Normal, Drought Risk, and Flood Risk predictions.
  - - `03_edge_cases/` - Boundary and edge case results (missing values, invalid state/month, extreme humidity, threshold values) run through the /predict endpoint.
    - - `04_data_variation/` - Results from a 15-row test matrix spanning all five states, multiple months/seasons, and all three threat classes.
      - - `05_environment_testing/` - Cross-browser, mobile-viewport, and local-vs-deployed performance/latency screenshots, plus hardware spec capture.
       
        - ## How to use this folder
       
        - 1. Work through each testing strategy described in the main README's Testing section.
          2. 2. Save each screenshot directly into the matching subfolder using the file naming convention noted there.
             3. 3. Commit and push the screenshots to this repository before recording the demo video, so the video can reference real, already-verified results.
               
                4. No results are pre-filled here - every screenshot in these folders should come from an actual run of the live system.
                5. 
