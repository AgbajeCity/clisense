import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  predictClimateRisk,
  fetchStates,
  DEFAULT_STATES,
  API_BASE_URL,
  type PredictionRequest,
  type PredictionResponse,
} from "@/lib/clisenseApi";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const RISK_STYLES: Record<string, { bg: string; label: string; emoji: string }> = {
  "Flood Risk": { bg: "bg-blue-600", label: "text-blue-100", emoji: "🌊" },
  "Drought Risk": { bg: "bg-amber-600", label: "text-amber-100", emoji: "🏜️" },
  Normal: { bg: "bg-emerald-600", label: "text-emerald-100", emoji: "🌱" },
};

const DEFAULTS: PredictionRequest = {
  state: "Kano",
  month: 8,
  rainfall_mm: 48,
  temp_c: 27,
  humidity_pct: 88,
  rain_7d: 180,
  rain_30d: 620,
};

export default function LivePredict() {
  const [states, setStates] = useState<string[]>(DEFAULT_STATES);
  const [form, setForm] = useState<PredictionRequest>(DEFAULTS);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates().then(setStates).catch(() => setStates(DEFAULT_STATES));
  }, []);

  const setNum = (key: keyof PredictionRequest, value: string) =>
    setForm((f) => ({ ...f, [key]: value === "" ? 0 : Number(value) }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await predictClimateRisk(form));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  const risk = result ? RISK_STYLES[result.prediction] ?? RISK_STYLES.Normal : null;

  const numberFields: { key: keyof PredictionRequest; label: string; step?: string }[] = [
    { key: "rainfall_mm", label: "Daily Rainfall (mm)" },
    { key: "temp_c", label: "Temperature (°C)", step: "0.1" },
    { key: "humidity_pct", label: "Humidity (%)" },
    { key: "rain_7d", label: "7-Day Rainfall (mm)" },
    { key: "rain_30d", label: "30-Day Rainfall (mm)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-emerald-900 text-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🌦️ Climate Threat Prediction</h1>
            <p className="text-emerald-300 text-sm mt-1">
              Live prediction from the Clisense ML model via the FastAPI backend.
            </p>
          </div>
          <Link to="/" className="text-emerald-300 hover:text-white text-sm underline">
            ← Home
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-emerald-800/40 p-6 ring-1 ring-emerald-700"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span>State</span>
            <select
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
              className="rounded-lg bg-emerald-950/60 px-3 py-2 ring-1 ring-emerald-700 focus:outline-none focus:ring-emerald-400"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span>Month</span>
            <select
              value={form.month}
              onChange={(e) => setForm((f) => ({ ...f, month: Number(e.target.value) }))}
              className="rounded-lg bg-emerald-950/60 px-3 py-2 ring-1 ring-emerald-700 focus:outline-none focus:ring-emerald-400"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>

          {numberFields.map(({ key, label, step }) => (
            <label key={key} className="flex flex-col gap-1 text-sm">
              <span>{label}</span>
              <input
                type="number"
                step={step ?? "1"}
                value={String(form[key])}
                onChange={(e) => setNum(key, e.target.value)}
                className="rounded-lg bg-emerald-950/60 px-3 py-2 ring-1 ring-emerald-700 focus:outline-none focus:ring-emerald-400"
              />
            </label>
          ))}

          <div className="sm:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? "Predicting…" : "Run Prediction"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-xl bg-red-900/60 px-4 py-3 text-red-100 ring-1 ring-red-700">
            <p className="font-semibold">Could not reach the prediction API.</p>
            <p className="text-sm mt-1 break-words">{error}</p>
            <p className="text-xs mt-2 text-red-200">
              Make sure the FastAPI backend is running at <code>{API_BASE_URL}</code>{" "}
              (<code>uvicorn app.api:app --reload --port 8000</code>).
            </p>
          </div>
        )}

        {result && risk && (
          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-emerald-700">
            <div className={`${risk.bg} px-6 py-5`}>
              <div className="text-3xl font-bold flex items-center gap-3">
                <span>{risk.emoji}</span>
                <span>{result.prediction}</span>
              </div>
              <div className={`mt-1 text-sm ${risk.label}`}>
                Confidence: {(result.confidence * 100).toFixed(1)}% · {result.state}, {MONTHS[result.month - 1]}
              </div>
            </div>
            <div className="bg-emerald-800/40 px-6 py-5 space-y-4">
              <p className="text-emerald-50">{result.recommendation}</p>
              <div className="space-y-2">
                {Object.entries(result.probabilities).map(([cls, p]) => (
                  <div key={cls}>
                    <div className="flex justify-between text-xs text-emerald-200 mb-1">
                      <span>{cls}</span>
                      <span>{(p * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-emerald-950/60">
                      <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{ width: `${Math.round(p * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-emerald-400">
          API: <code>{API_BASE_URL}</code>
        </p>
      </div>
    </div>
  );
}
