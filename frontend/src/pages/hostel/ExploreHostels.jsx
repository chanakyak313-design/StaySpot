import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Map, List, X, ArrowLeft } from "lucide-react";
import { searchHostels } from "../../services/hostelService";
import HostelCard from "../../components/hostel/HostelCard";
import HostelCardSkeleton from "../../components/hostel/HostelCardSkeleton";
import HostelDetailPanel from "../../components/hostel/HostelDetailPanel";
import HostelsMapView from "../../components/map/HostelsMapView";

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-1", "rotate-2", "-rotate-2"];

const SHARING_OPTIONS = ["Single", "Double", "Triple", "Four", "Six", "Eight"];

const SORT_OPTIONS = [
  { value: "default", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
];

function lowestPrice(hostel) {
  if (!hostel.rooms || hostel.rooms.length === 0) return Infinity;
  return Math.min(...hostel.rooms.map((r) => r.price));
}

function ExploreHostels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [sort, setSort] = useState("default");

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("budget") || "");
  const [wifi, setWifi] = useState(false);
  const [food, setFood] = useState(false);
  const [parking, setParking] = useState(false);
  const [ac, setAc] = useState(false);
  const [laundry, setLaundry] = useState(false);
  const [sharingType, setSharingType] = useState("");

  const selectedHostelId = searchParams.get("selected");

  const selectHostel = (hostelId) => {
    const next = new URLSearchParams(searchParams);
    next.set("selected", hostelId);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToResults = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("selected");
    setSearchParams(next);
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = async (e, customParams = null) => {
    if (e) e.preventDefault();
    setLoading(true);

    const params = customParams !== null ? customParams : {};
    if (customParams === null) {
      if (city) params.city = city;
      if (maxPrice) params.max_price = maxPrice;
      if (wifi) params.wifi = true;
      if (food) params.food = true;
      if (parking) params.parking = true;
      if (ac) params.ac = true;
      if (laundry) params.laundry = true;
      if (sharingType) params.sharing_type = sharingType;
      if (selectedHostelId) params.selected = selectedHostelId;
    }

    setSearchParams(params);

    try {
      const data = await searchHostels(params);
      setHostels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCity("");
    setMaxPrice("");
    setWifi(false);
    setFood(false);
    setParking(false);
    setAc(false);
    setLaundry(false);
    setSharingType("");
    runSearch(null, {});
  };

  const toggleFilter = (setter) => setter((prev) => !prev);

  const activeFilterCount = [wifi, food, parking, ac, laundry, !!sharingType, !!city, !!maxPrice].filter(Boolean).length;

  const sortedHostels = useMemo(() => {
    const list = [...hostels];
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => lowestPrice(a) - lowestPrice(b));
      case "price_desc":
        return list.sort((a, b) => lowestPrice(b) - lowestPrice(a));
      case "rating_desc":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return list;
    }
  }, [hostels, sort]);

  const toggleChips = [
    { label: "Wi-Fi", value: wifi, setter: setWifi },
    { label: "Food", value: food, setter: setFood },
    { label: "Parking", value: parking, setter: setParking },
    { label: "AC", value: ac, setter: setAc },
    { label: "Laundry", value: laundry, setter: setLaundry },
  ];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2">
              The Notice Board
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
              EXPLORE HOSTELS
            </h1>
          </div>

          <div className="flex poster-border rounded-xl overflow-hidden bg-paper">
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2.5 flex items-center gap-1.5 text-sm font-semibold ${view === "list" ? "bg-marigold text-ink" : "text-ink"}`}
            >
              <List size={16} /> List
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-4 py-2.5 flex items-center gap-1.5 text-sm font-semibold border-l-2 border-ink ${view === "map" ? "bg-marigold text-ink" : "text-ink"}`}
            >
              <Map size={16} /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter bar */}
        <form
          onSubmit={runSearch}
          className="bg-skytape poster-border hard-shadow-sm rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-bold uppercase text-pencil block mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Hyderabad"
                className="w-full poster-border rounded-xl py-3 px-4 bg-paper focus:outline-none focus:ring-2 focus:ring-marigold font-medium"
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Max Budget</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="₹ per month"
                className="w-full poster-border rounded-xl py-3 px-4 bg-paper focus:outline-none focus:ring-2 focus:ring-marigold font-medium"
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Sharing Type</label>
              <select
                value={sharingType}
                onChange={(e) => setSharingType(e.target.value)}
                className="w-full poster-border rounded-xl py-3 px-4 bg-paper font-medium"
              >
                <option value="">Any</option>
                {SHARING_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s} Sharing</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn-poster bg-ink text-white px-6 py-3 hard-shadow-sm flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {toggleChips.map((f) => (
              <button
                type="button"
                key={f.label}
                onClick={() => toggleFilter(f.setter)}
                className={`stamp-badge px-4 py-2 text-xs transition-colors ${
                  f.value ? "bg-marigold text-ink" : "bg-paper text-pencil"
                }`}
              >
                {f.label}
              </button>
            ))}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-coral hover:underline ml-2"
              >
                <X size={13} /> Clear all ({activeFilterCount})
              </button>
            )}
          </div>
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {selectedHostelId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={backToResults}
                className="btn-poster bg-paper text-ink px-5 py-2.5 hard-shadow-sm flex items-center gap-2 mb-6"
              >
                <ArrowLeft size={16} />
                Back to results
              </button>
              <div className="poster-border hard-shadow rounded-2xl overflow-hidden">
                <HostelDetailPanel hostelId={selectedHostelId} />
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
              {["rotate-0", "rotate-0", "rotate-0", "rotate-0", "rotate-0", "rotate-0"].map((rotate, i) => (
                <HostelCardSkeleton key={i} rotate={rotate} />
              ))}
            </motion.div>
          ) : hostels.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 poster-border rounded-2xl bg-skytape"
            >
              <SlidersHorizontal className="mx-auto text-pencil mb-4" size={32} />
              <p className="font-display text-xl text-ink">NO MATCHES FOUND</p>
              <p className="text-pencil mt-2">Try widening your search — a different city or a higher budget.</p>
            </motion.div>
          ) : view === "map" ? (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-pencil font-medium mb-6">
                {hostels.length} hostel{hostels.length !== 1 ? "s" : ""} found
              </p>
              <HostelsMapView hostels={hostels} onSelect={selectHostel} />
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <p className="text-pencil font-medium">
                  {hostels.length} hostel{hostels.length !== 1 ? "s" : ""} found
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="poster-border rounded-xl py-2 px-3 bg-paper font-semibold text-sm"
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {sortedHostels.map((hostel, i) => (
                  <motion.div
                    key={hostel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.05 }}
                  >
                    <HostelCard
                      hostel={hostel}
                      rotate={ROTATIONS[i % ROTATIONS.length]}
                      onSelect={selectHostel}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ExploreHostels;
