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
