// Client for the Clisense FastAPI backend (app/api.py).
// Set VITE_API_URL in web/.env to point at the API (local or deployed).

export const DEFAULT_STATES = ["Kano", "Kaduna", "Benue", "Niger", "Plateau"];

const RAW_API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
export const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

export interface PredictionRequest {
  state: string;
  month: number;
  rainfall_mm: number;
  temp_c: number;
  humidity_pct: number;
  rain_7d: number;
  rain_30d: number;
}

export type RiskLabel = "Normal" | "Drought Risk" | "Flood Risk";

export interface PredictionResponse {
  state: string;
  month: number;
  prediction: RiskLabel;
  confidence: number;
  probabilities: Record<string, number>;
  recommendation: string;
  sms: string;
}

export async function predictClimateRisk(
  req: PredictionRequest
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    let detail = `Request failed (HTTP ${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) {
        detail =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
      }
    } catch {
      /* keep the default message */
    }
    throw new Error(detail);
  }

  return res.json();
}

export async function fetchStates(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/states`);
    if (!res.ok) return DEFAULT_STATES;
    const data = await res.json();
    return Array.isArray(data?.states) && data.states.length
      ? data.states
      : DEFAULT_STATES;
  } catch {
    return DEFAULT_STATES;
  }
}

// ---- Data Explorer ----

export interface MonthlyPoint {
  state: string;
  month: number;
  rainfall_mm: number;
  temp_c: number;
  humidity_pct: number;
}

export interface ExploreData {
  states: string[];
  monthly: MonthlyPoint[];
  threat_by_month: Array<{ month: number } & Record<string, number>>;
  class_distribution: Record<string, number>;
}

export async function fetchExplore(): Promise<ExploreData> {
  const res = await fetch(`${API_BASE_URL}/explore`);
  if (!res.ok) throw new Error(`Explore data failed (HTTP ${res.status})`);
  return res.json();
}

// ---- Model info ----

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelInfo {
  algorithm: string;
  accuracy: number;
  weighted_f1: number;
  n_samples: number;
  n_train: number;
  n_test: number;
  classes: string[];
  class_distribution: Record<string, number>;
  feature_importances: FeatureImportance[];
  confusion_matrix: number[][];
}

export async function fetchModelInfo(): Promise<ModelInfo> {
  const res = await fetch(`${API_BASE_URL}/model-info`);
  if (!res.ok) throw new Error(`Model info failed (HTTP ${res.status})`);
  return res.json();
}
