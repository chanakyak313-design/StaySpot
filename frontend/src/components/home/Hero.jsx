import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountUpComponent from "react-countup";
import { ArrowRight, MapPin, IndianRupee } from "lucide-react";
import { getStats } from "../../services/statsService";

const CountUp = CountUpComponent?.default ?? CountUpComponent;

function Hero() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (budget) params.set("budget", budget);
    navigate(`/hostels?${params.toString()}`);
  };

  const statItems = stats
    ? [
        { value: stats.hostels, label: "Verified Hostels" },
        { value: stats.students, label: "Students on StaySpot" },
        { value: stats.bookings, label: "Bookings Made" },
      ]
    : [];

  return (
    <section className="bg-skytape relative overflow-hidden border-b-[3px] border-ink">
      {/* Ambient poster dots */}
      <div className="absolute top-10 right-[8%] w-4 h-4 rounded-full bg-coral border-2 border-ink hidden md:block" />
      <div className="absolute bottom-24 left-[6%] w-3 h-3 rounded-full bg-marigold border-2 border-ink hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="stamp-badge inline-block bg-marigold text-ink px-4 py-1.5 text-xs -rotate-2">
              {stats && stats.cities > 0
                ? `Now Live in ${stats.cities}+ ${stats.cities === 1 ? "City" : "Cities"}`
                : "Now Live Across India"}
            </span>

            <h1 className="mt-6 font-display text-5xl md:text-6xl leading-[1.05] text-ink">
              FIND YOUR
              <br />
              <span className="relative inline-block">
                HOSTEL.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="14"
                  viewBox="0 0 220 14"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 10 Q 55 2, 110 8 T 218 6"
                    stroke="#FF5A4E"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              NOT YOUR HEADACHE.
            </h1>

            <p className="mt-8 text-lg text-pencil leading-8 max-w-md">
              Verified hostels, honest prices, and real availability —
              posted straight from owners, no middlemen markup.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/hostels")}
                className="btn-poster bg-ink text-white px-7 py-4 hard-shadow-coral flex items-center gap-2"
              >
                Explore Hostels
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/ai")}
                className="btn-poster bg-paper text-ink px-7 py-4 hard-shadow-sm"
              >
                Ask StaySpot AI
              </motion.button>
            </div>

            {statItems.length > 0 && (
              <div className="mt-14 flex flex-wrap gap-10">
                {statItems.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  >
                    <h2 className="font-display text-3xl text-ink">
                      <CountUp end={stat.value} duration={1.5} />+
                    </h2>
                    <p className="text-pencil font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Side - "pinned index card" search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="pin-dot" />
            <form
              onSubmit={handleSearch}
              className="bg-paper poster-border hard-shadow rounded-2xl p-8 rotate-1 hover:rotate-0 transition-transform duration-300"
            >
              <h2 className="font-display text-xl text-ink">
                SEARCH THE BOARD
              </h2>
              <p className="text-pencil mt-2 text-sm">
                Find a hostel by city and budget.
              </p>

              <div className="mt-8 space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-coral" size={20} />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city (e.g. Hyderabad)"
                    className="w-full poster-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-marigold font-medium"
                  />
                </div>

                <div className="relative">
                  <IndianRupee className="absolute left-4 top-4 text-coral" size={20} />
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Maximum monthly budget"
                    className="w-full poster-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-marigold font-medium"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-poster w-full bg-marigold text-ink py-4 hard-shadow-sm"
                >
                  Search Hostels
                </motion.button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
