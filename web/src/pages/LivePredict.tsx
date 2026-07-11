import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import {
  predictClimateRisk, fetchStates, fetchExplore, fetchModelInfo,
  DEFAULT_STATES, API_BASE_URL,
  type PredictionRequest, type PredictionResponse,
  type ExploreData, type ModelInfo,
} from "@/lib/clisenseApi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STATE_COLORS = ["#34d399","#60a5fa","#fbbf24","#f472b6","#a78bfa"];
const RISK_COLORS: Record<string, string> = {
  "Flood Risk": "#3b82f6", "Drought Risk": "#f59e0b", Normal: "#10b981",
};
const RISK_STYLE: Record<string, { bg: string; emoji: string }> = {
  "Flood Risk": { bg: "bg-blue-600", emoji: "🌊" },
  "Drought Risk": { bg: "bg-amber-600", emoji: "🏜️" },
  Normal: { bg: "bg-emerald-600", emoji: "🌱" },
};
const DEFAULTS: PredictionRequest = {
  state: "Kano", month: 8, rainfall_mm: 48, temp_c: 27,
  humidity_pct: 88, rain_7d: 180, rain_30d: 620,
};
type Tab = "predict" | "explore" | "model" | "about";

export default function LivePredict() {
  const [tab, setTab] = useState<Tab>("predict");

  // Predict
  const [states, setStates] = useState<string[]>(DEFAULT_STATES);
  const [form, setForm] = useState<PredictionRequest>(DEFAULTS);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [pLoading, setPLoading] = useState(false);
  const [pError, setPError] = useState<string | null>(null);

  // Explore + Model
  const [explore, setExplore] = useState<ExploreData | null>(null);
  const [metric, setMetric] = useState<"rainfall_mm" | "temp_c" | "humidity_pct">("rainfall_mm");
  const [model, setModel] = useState<ModelInfo | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => { fetchStates().then(setStates).catch(() => setStates(DEFAULT_STATES)); }, []);
  useEffect(() => {
    if (tab === "explore" && !explore)
      fetchExplore().then(setExplore).catch((e) => setLoadErr(String(e.message || e)));
    if (tab === "model" && !model)
      fetchModelInfo().then(setModel).catch((e) => setLoadErr(String(e.message || e)));
  }, [tab, explore, model]);

  const setNum = (k: keyof PredictionRequest, v: string) =>
    setForm((f) => ({ ...f, [k]: v === "" ? 0 : Number(v) }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPLoading(true); setPError(null); setResult(null);
    try { setResult(await predictClimateRisk(form)); }
    catch (err) { setPError(err instanceof Error ? err.message : "Prediction failed"); }
    finally { setPLoading(false); }
  }

  const numberFields: { key: keyof PredictionRequest; label: string; step?: string }[] = [
    { key: "rainfall_mm", label: "Daily Rainfall (mm)" },
    { key: "temp_c", label: "Temperature (°C)", step: "0.1" },
    { key: "humidity_pct", label: "Humidity (%)" },
    { key: "rain_7d", label: "7-Day Rainfall (mm)" },
    { key: "rain_30d", label: "30-Day Rainfall (mm)" },
  ];
  const risk = result ? RISK_STYLE[result.prediction] ?? RISK_STYLE.Normal : null;

  const TABS: { id: Tab; label: string }[] = [
    { id: "predict", label: "🎯 Predict" },
    { id: "explore", label: "📊 Data Explorer" },
    { id: "model", label: "📈 Model" },
    { id: "about", label: "ℹ️ About" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-emerald-900 text-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🌦️ Clisense — Climate Intelligence</h1>
            <p className="text-emerald-300 text-sm mt-1">Live ML predictions and model insights via the FastAPI backend.</p>
          </div>
          <Link to="/" className="text-emerald-300 hover:text-white text-sm underline whitespace-nowrap">← Home</Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t.id ? "bg-emerald-500 text-emerald-950" : "bg-emerald-800/50 text-emerald-100 hover:bg-emerald-700/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "predict" && (
          <>
            <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-emerald-800/40 p-6 ring-1 ring-emerald-700">
              <label className="flex flex-col gap-1 text-sm">
                <span>State</span>
                <select value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  className="rounded-lg bg-emerald-950/60 px-3 py-2 ring-1 ring-emerald-700 focus:outline-none focus:ring-emerald-400">
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span>Month</span>
                <select value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: Number(e.target.value) }))}
                  className="rounded-lg bg-emerald-950/60 px-3 py-2 ring-1 ring-emerald-700 focus:outline-none focus:ring-emerald-400">
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
              </label>
              {numberFields.map(({ key, label, step }) => (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span>{label}</span>
                  <input type="number" step={step ?? "1"} value={String(form[key])} onChange={(e) => setNum(key, e.target.value)}
                    className="rounded-lg bg-emerald-950/60 px-3 py-2 ring-1 ring-emerald-700 focus:outline-none focus:ring-emerald-400" />
                </label>
              ))}
              <div className="sm:col-span-2 mt-2">
                <button type="submit" disabled={pLoading}
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-emerald-950 hover:bg-emerald-400 disabled:opacity-60">
                  {pLoading ? "Predicting…" : "Run Prediction"}
                </button>
              </div>
            </form>

            {pError && (
              <div className="mt-6 rounded-xl bg-red-900/60 px-4 py-3 text-red-100 ring-1 ring-red-700">
                <p className="font-semibold">Could not reach the prediction API.</p>
                <p className="text-sm mt-1 break-words">{pError}</p>
              </div>
            )}

            {result && risk && (
              <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-emerald-700">
                <div className={`${risk.bg} px-6 py-5`}>
                  <div className="text-3xl font-bold flex items-center gap-3"><span>{risk.emoji}</span><span>{result.prediction}</span></div>
                  <div className="mt-1 text-sm text-white/90">Confidence: {(result.confidence * 100).toFixed(1)}% · {result.state}, {MONTHS[result.month - 1]}</div>
                </div>
                <div className="bg-emerald-800/40 px-6 py-5 space-y-4">
                  <p>{result.recommendation}</p>
                  <div className="space-y-2">
                    {Object.entries(result.probabilities).map(([cls, p]) => (
                      <div key={cls}>
                        <div className="flex justify-between text-xs text-emerald-200 mb-1"><span>{cls}</span><span>{(p * 100).toFixed(1)}%</span></div>
                        <div className="h-2 rounded-full bg-emerald-950/60">
                          <div className="h-2 rounded-full" style={{ width: `${Math.round(p * 100)}%`, background: RISK_COLORS[cls] ?? "#34d399" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "explore" && (
          <div className="space-y-6">
            {!explore && !loadErr && <p className="text-emerald-300">Loading dataset…</p>}
            {loadErr && !explore && (
              <div className="rounded-xl bg-red-900/60 px-4 py-3 text-red-100 ring-1 ring-red-700">
                <p className="font-semibold">Could not load explorer data.</p>
                <p className="text-sm mt-1 break-words">{loadErr}</p>
              </div>
            )}
            {explore && (() => {
              const metricLabel = { rainfall_mm: "Rainfall (mm)", temp_c: "Temperature (°C)", humidity_pct: "Humidity (%)" }[metric];
              const lineData = MONTHS.map((label, i) => {
                const month = i + 1;
                const row: Record<string, number | string> = { month: label };
                explore.states.forEach((st) => {
                  const p = explore.monthly.find((m) => m.state === st && m.month === month);
                  if (p) row[st] = p[metric];
                });
                return row;
              });
              const threatData = explore.threat_by_month.map((r) => ({ ...r, month: MONTHS[(r.month as number) - 1] }));
              const axis = { tick: { fill: "#a7f3d0", fontSize: 12 }, stroke: "#065f46" };
              const tip = { contentStyle: { background: "#064e3b", border: "1px solid #065f46", color: "#ecfdf5", borderRadius: 8 } };
              return (
                <>
                  <div className="rounded-2xl bg-emerald-800/40 p-5 ring-1 ring-emerald-700">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-emerald-200">Metric:</span>
                      {([["rainfall_mm","Rainfall"],["temp_c","Temperature"],["humidity_pct","Humidity"]] as const).map(([k, lbl]) => (
                        <button key={k} onClick={() => setMetric(k)}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${metric === k ? "bg-emerald-500 text-emerald-950" : "bg-emerald-900/60 text-emerald-100"}`}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <h3 className="mb-3 font-semibold">{metricLabel} by month, per state</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineData} margin={{ left: -10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0f5132" />
                        <XAxis dataKey="month" {...axis} />
                        <YAxis {...axis} />
                        <Tooltip {...tip} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        {explore.states.map((st, i) => (
                          <Line key={st} type="monotone" dataKey={st} stroke={STATE_COLORS[i % STATE_COLORS.length]} strokeWidth={2} dot={false} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-2xl bg-emerald-800/40 p-5 ring-1 ring-emerald-700">
                    <h3 className="mb-3 font-semibold">Climate threat distribution by month</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={threatData} margin={{ left: -10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0f5132" />
                        <XAxis dataKey="month" {...axis} />
                        <YAxis {...axis} />
                        <Tooltip {...tip} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="Normal" stackId="a" fill={RISK_COLORS.Normal} />
                        <Bar dataKey="Drought Risk" stackId="a" fill={RISK_COLORS["Drought Risk"]} />
                        <Bar dataKey="Flood Risk" stackId="a" fill={RISK_COLORS["Flood Risk"]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-center text-xs text-emerald-400">
                    Aggregated from the synthetic 18,530-row Nigerian climate dataset (5 states × 12 months).
                  </p>
                </>
              );
            })()}
          </div>
        )}

        {tab === "model" && (
          <div className="space-y-6">
            {!model && !loadErr && <p className="text-emerald-300">Loading model info…</p>}
            {loadErr && !model && (
              <div className="rounded-xl bg-red-900/60 px-4 py-3 text-red-100 ring-1 ring-red-700">
                <p className="font-semibold">Could not load model info.</p>
                <p className="text-sm mt-1 break-words">{loadErr}</p>
              </div>
            )}
            {model && (() => {
              const axis = { tick: { fill: "#a7f3d0", fontSize: 12 }, stroke: "#065f46" };
              const tip = { contentStyle: { background: "#064e3b", border: "1px solid #065f46", color: "#ecfdf5", borderRadius: 8 } };
              const topFeatures = model.feature_importances.slice(0, 10);
              const dist = model.classes.map((c) => ({ name: c, count: model.class_distribution[c] ?? 0 }));
              const cards = [
                { label: "Test Accuracy", value: `${(model.accuracy * 100).toFixed(2)}%` },
                { label: "Weighted F1", value: model.weighted_f1.toFixed(4) },
                { label: "Algorithm", value: model.algorithm },
                { label: "Samples (train / test)", value: `${model.n_train?.toLocaleString()} / ${model.n_test?.toLocaleString()}` },
              ];
              return (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((c) => (
                      <div key={c.label} className="rounded-2xl bg-emerald-800/40 p-5 ring-1 ring-emerald-700">
                        <div className="text-2xl font-bold">{c.value}</div>
                        <div className="text-xs text-emerald-300 mt-1">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-emerald-800/40 p-5 ring-1 ring-emerald-700">
                    <h3 className="mb-3 font-semibold">Top feature importances</h3>
                    <ResponsiveContainer width="100%" height={360}>
                      <BarChart data={topFeatures} layout="vertical" margin={{ left: 30, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0f5132" />
                        <XAxis type="number" {...axis} />
                        <YAxis type="category" dataKey="feature" width={110} {...axis} />
                        <Tooltip {...tip} />
                        <Bar dataKey="importance" fill="#34d399" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-2xl bg-emerald-800/40 p-5 ring-1 ring-emerald-700">
                    <h3 className="mb-3 font-semibold">Class distribution (dataset)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={dist} margin={{ left: -10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#0f5132" />
                        <XAxis dataKey="name" {...axis} />
                        <YAxis {...axis} />
                        <Tooltip {...tip} />
                        <Bar dataKey="count">
                          {dist.map((d) => <Cell key={d.name} fill={RISK_COLORS[d.name] ?? "#34d399"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {tab === "about" && (
          <div className="rounded-2xl bg-emerald-800/40 p-6 ring-1 ring-emerald-700 space-y-3 text-sm leading-relaxed">
            <h3 className="text-lg font-semibold">About Clisense</h3>
            <p>Clisense is an AI-powered early-warning system that helps smallholder farmers in rural Nigeria act on near-term climate risk. Given a state, month, and current weather readings, an XGBoost model classifies the risk as <strong>Normal</strong>, <strong>Drought Risk</strong>, or <strong>Flood Risk</strong> with a plain-language recommendation.</p>
            <p>This dashboard is the React frontend of the Clisense monorepo. Predictions, dataset aggregates, and model metrics are served live by the FastAPI backend (the same <code>model_core</code> that powers the Streamlit dashboard and the notebook), so there is a single source of truth.</p>
            <p className="text-emerald-300">ALU Mission Capstone 2026 · H. Ayomide Agbaje · Supervisor: Ndinelao Iitumba</p>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-emerald-400">API: <code>{API_BASE_URL}</code></p>
      </div>
    </div>
  );
}
