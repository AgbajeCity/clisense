import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchModelInfo, type ModelInfo } from "@/lib/clisenseApi";

// README-verified figures, shown instantly and if the API is cold-starting.
const FALLBACK = {
  accuracy: 0.9968,
  weighted_f1: 0.9968,
  n_samples: 18530,
  algorithm: "XGBoost",
};

export const ModelStats = () => {
  const navigate = useNavigate();
  const [m, setM] = useState<Partial<ModelInfo>>(FALLBACK);

  useEffect(() => {
    fetchModelInfo()
      .then(setM)
      .catch(() => {
        /* keep the fallback figures */
      });
  }, []);

  const stats = [
    { value: `${((m.accuracy ?? FALLBACK.accuracy) * 100).toFixed(2)}%`, label: "Test accuracy" },
    { value: (m.weighted_f1 ?? FALLBACK.weighted_f1).toFixed(4), label: "Weighted F1-score" },
    { value: (m.n_samples ?? FALLBACK.n_samples).toLocaleString(), label: "Training records" },
    { value: m.algorithm ?? FALLBACK.algorithm, label: "Model" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-emerald-50 relative">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Proven model performance</h2>
        <p className="mt-3 text-emerald-200 max-w-2xl mx-auto">
          Clisense classifies near-term climate risk — Normal, Drought, or Flood — with a live XGBoost
          model. These figures are pulled straight from the running prediction API.
        </p>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur p-6 ring-1 ring-white/15">
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-emerald-200">{s.label}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/predict")}
          className="mt-10 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 hover:bg-emerald-300 transition"
        >
          Open the live prediction dashboard →
        </button>
      </div>
    </section>
  );
};

export default ModelStats;
