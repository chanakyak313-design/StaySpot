import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Send, Bot, Building2, MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import HostelCard from "../components/hostel/HostelCard";

const SUGGESTED_QUERIES = [
  "Hostels in Gachibowli Hyderabad under ₹7000",
  "Private AC room in Koramangala Bangalore",
  "Budget student PG in Pune near university with food",
  "Hostel with high speed WiFi and power backup in Mumbai",
  "Single sharing room in Delhi under ₹10000",
];

export default function AIRecommendation() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [matchedHostels, setMatchedHostels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setResult("");
    setMatchedHostels([]);

    try {
      const res = await api.post("/ai/recommend", { query: q });
      setResult(res.data.response);
      if (res.data.hostels && Array.isArray(res.data.hostels)) {
        setMatchedHostels(res.data.hostels);
      }
    } catch (err) {
      console.error(err);
      toast.error("AI is having trouble right now — please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2 font-bold">
            Intelligent Discovery
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-white mt-4 flex items-center gap-3">
            <Sparkles className="text-marigold" size={32} /> STAYSPOT AI CONCIERGE
          </h1>
          <p className="text-white/70 mt-2 max-w-xl text-sm md:text-base">
            Tell us your budget, preferred city, required amenities, or university campus in plain words.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Search Box Card */}
        <div className="poster-border hard-shadow rounded-2xl p-8 bg-paper relative">
          <div className="pin-dot" />

          <label className="text-xs font-bold uppercase text-pencil block mb-3">
            What kind of place are you looking for?
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Single room under ₹8000 in Hyderabad with food & wifi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 poster-border rounded-xl px-5 py-4 font-medium text-base focus:outline-none focus:ring-2 focus:ring-marigold bg-paper"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="btn-poster bg-marigold text-ink px-8 py-4 hard-shadow-sm flex items-center justify-center gap-2 font-bold text-base disabled:opacity-60"
            >
              <Send size={18} />
              {loading ? "Searching..." : "Ask AI"}
            </button>
          </div>

          {/* Suggestion Chips */}
          <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/15">
            <p className="text-xs font-bold uppercase text-pencil mb-2.5">
              Popular Prompts:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((item) => (
                <button
                  key={item}
                  onClick={() => handleChipClick(item)}
                  disabled={loading}
                  className="stamp-badge text-xs px-3 py-1.5 bg-skytape hover:bg-marigold transition-colors disabled:opacity-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-16 poster-border rounded-2xl bg-skytape/50 animate-pulse">
            <Bot size={40} className="mx-auto text-ink mb-3 animate-bounce" />
            <p className="font-display text-xl text-ink">ANALYZING HOSTEL VACANCIES...</p>
            <p className="text-pencil text-sm mt-1">Cross-referencing verified amenities, budget ranges, and localities.</p>
          </div>
        )}

        {/* AI Answer & Matching Results */}
        {result && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* AI Insights Card */}
            <div className="poster-border hard-shadow rounded-2xl p-8 bg-mint">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-paper border-2 border-ink flex items-center justify-center">
                  <Bot size={16} className="text-ink" />
                </span>
                <span className="stamp-badge bg-ink text-white px-3 py-1 text-xs font-bold">
                  AI Recommendation
                </span>
              </div>

              <div className="bg-paper poster-border rounded-xl p-6 whitespace-pre-wrap font-body text-ink leading-relaxed text-sm md:text-base">
                {result}
              </div>
            </div>

            {/* Matching Hostel Cards Grid */}
            {matchedHostels.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="stamp-badge bg-marigold text-ink px-3 py-1 text-xs font-bold inline-block">
                      Matches Found
                    </span>
                    <h2 className="font-display text-2xl text-ink mt-1">
                      TOP MATCHING HOSTELS ({matchedHostels.length})
                    </h2>
                  </div>
                  <Link
                    to="/hostels"
                    className="btn-poster bg-paper text-ink px-4 py-2 text-xs font-bold hard-shadow-sm flex items-center gap-1"
                  >
                    View All in Explore <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedHostels.map((h) => {
                    const hostelObj = {
                      id: h.id,
                      hostel_name: h.name || h.hostel_name,
                      area: h.area,
                      city: h.city,
                      rating: h.rating,
                      wifi: h.wifi,
                      food: h.food,
                      parking: h.parking,
                      images: h.image ? [{ image_url: h.image }] : (h.images || []),
                      rooms: h.price ? [{ price: h.price }] : (h.rooms || []),
                    };

                    return <HostelCard key={h.id || h.name} hostel={hostelObj} />;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
