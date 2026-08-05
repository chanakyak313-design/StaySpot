import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Send } from "lucide-react";
import api from "../services/api";

export default function AIRecommendation() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const res = await api.post("/ai/recommend", { query });
      setResult(res.data.response);
    } catch (err) {
      console.error(err);
      toast.error("AI is having trouble right now — try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-2xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2">
            Ask the Board
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4 flex items-center gap-3">
            <Sparkles className="text-marigold" size={28} /> STAYSPOT AI
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="poster-border hard-shadow rounded-2xl p-8 bg-paper">
          <p className="text-pencil mb-5">
            Describe what you're looking for, in plain words.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Need a PG under ₹7000 near Madhapur with WiFi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-poster bg-marigold text-ink px-6 py-3 hard-shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send size={16} />
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </div>

          {result && (
            <div className="mt-8 pt-8 border-t-2 border-dashed border-ink/15">
              <span className="stamp-badge inline-block bg-mint px-3 py-1 text-xs mb-4">
                Suggestion
              </span>
              <pre className="whitespace-pre-wrap font-body text-ink leading-relaxed">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
