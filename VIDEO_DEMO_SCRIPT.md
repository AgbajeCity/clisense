# Clisense — Video Demo Script
ALU Mission Capstone 2026 | H. Ayomide Agbaje

Target Duration: 5 minutes
Format: Screen recording with narration
Tool: Loom, OBS, or QuickTime

Per the assignment guidance, this script skips sign-up and sign-in entirely and focuses on core functionality: live predictions, the API, and model performance.

## Pre-Recording Checklist
- Open the live Streamlit app: https://agbajecity-clisense.streamlit.app
- - Open the FastAPI docs: https://clisense-production.up.railway.app/docs
  - - Have this script open on a second screen or phone
    - - Close irrelevant browser tabs and turn off notifications
      - - Test microphone and screen capture, then do one dry run before the final take
       
        - ## Script Outline
       
        - ### [0:00 - 0:15] Introduction
        - "Hello, I'm Ayomide Agbaje, and this is Clisense, a Machine Learning-powered predictive climate intelligence and early warning system for smallholder farmers in rural Nigeria. This is my ALU Mission Capstone 2026 project."
       
        - ### [0:15 - 0:30] Problem Statement
        - "Nigeria has around 33 million smallholder farmers producing most of the country's food, largely without access to local climate forecasting. Floods in Benue and droughts in Kano cost livelihoods every year. Clisense predicts these threats before they happen."
       
        - ### [0:30 - 2:00] Live Demo - Prediction Tab (Streamlit)
        - - Navigate to the Prediction tab
          - - Input: State = Benue, Month = 8, Rainfall = 48mm, Temp = 27C, Humidity = 88%, 7-Day Rain = 180mm, 30-Day Rain = 620mm
            - - "The model predicts Flood Risk with over 90% confidence, and provides an actionable recommendation for the farmer."
              - - Input: State = Kano, Month = 6, Rainfall = 0.3mm, Temp = 32.5C, Humidity = 32%, 7-Day Rain = 2.1mm, 30-Day Rain = 12mm
                - - "For Kano in June, the model correctly identifies Drought Risk instead."
                  - - Input: State = Kaduna, Month = 10, Rainfall = 5.2mm, Temp = 26C, Humidity = 65%, 7-Day Rain = 28mm, 30-Day Rain = 95mm
                    - - "And for contrast, Kaduna in October returns Normal, with no alert needed."
                     
                      - ### [2:00 - 3:00] Model Performance Tab
                      - - Show the accuracy metrics and confusion matrix
                        - - "Clisense uses an XGBoost classifier trained on over 18,500 daily climate records across 5 Nigerian agro-ecological zones, reaching 99.84% accuracy on held-out test data. The strongest predictors are 7-day and 30-day cumulative rainfall."
                         
                          - ### [3:00 - 4:00] API Demo (FastAPI Swagger)
                          - - Navigate to FastAPI /docs
                            - - Expand POST /predict, click Try it out
                              - - Paste the Kano drought example and execute
                                - - "The same prediction engine is exposed as a REST API, so any system, an SMS gateway, a mobile app, or a government platform, can call it directly with a simple HTTP request."
                                 
                                  - ### [4:00 - 4:45] GitHub and Architecture
                                  - - Show the GitHub repo structure briefly
                                    - - "The full source is open on GitHub, with a clean separation between the ML pipeline, the Streamlit frontend, and the FastAPI backend."
                                     
                                      - ### [4:45 - 5:00] Closing
                                      - "That's Clisense. Full testing documentation, the deployed app, and this video are all linked in the README. Thank you for watching."
                                     
                                      - ## Post-Recording Checklist
                                      - - Trim dead air from the start and end
                                        - - Export at 1080p and upload to Loom or YouTube as Unlisted
                                          - - Paste the link into the README under Live Links
                                            - - File name: Clisense_Demo_Ayomide_Agbaje.mp4
                                             
                                              - ---
                                              Clisense — ALU Mission Capstone 2026 | H. Ayomide Agbaje
                                              
