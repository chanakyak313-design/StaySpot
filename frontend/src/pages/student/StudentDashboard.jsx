import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, Search, Sparkles } from "lucide-react";
import { getMyBookings } from "../../services/bookingService";
import { getFavorites } from "../../services/favoriteService";

function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fullName = localStorage.getItem("fullName");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try {
      const [b, f] = await Promise.allSettled([
        getMyBookings(),
        userId ? getFavorites(userId) : Promise.resolve([]),
      ]);
      if (b.status === "fulfilled") setBookings(b.value);
      if (f.status === "fulfilled") setFavoritesCount(f.value.length);
    } finally {
      setLoading(false);
    }
  }

  const activeBooking = bookings.find((b) => b.status === "Confirmed" || b.status === "Pending");

  const quickLinks = [
    { to: "/hostels", label: "Explore Hostels", icon: Search, bg: "bg-marigold" },
    { to: "/favorites", label: "My Favorites", icon: Heart, bg: "bg-coral text-white" },
    { to: "/my-bookings", label: "My Bookings", icon: Calendar, bg: "bg-skytape" },
    { to: "/ai", label: "Ask StaySpot AI", icon: Sparkles, bg: "bg-mint" },
  ];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2">
            Student Dashboard
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            {fullName ? `HEY, ${fullName.split(" ")[0].toUpperCase()}!` : "WELCOME!"}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {quickLinks.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to}
                to={q.to}
                className={`poster-border hard-shadow-sm rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform ${q.bg}`}
              >
                <Icon size={26} />
                <span className="font-semibold text-sm">{q.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-5 mb-12">
          <div className="poster-border rounded-2xl p-6 bg-skytape">
            <p className="text-xs font-bold uppercase text-pencil mb-1">Favorites Saved</p>
            <p className="font-display text-3xl text-ink">{loading ? "..." : favoritesCount}</p>
          </div>
          <div className="poster-border rounded-2xl p-6 bg-mint">
            <p className="text-xs font-bold uppercase text-pencil mb-1">Total Bookings</p>
            <p className="font-display text-3xl text-ink">{loading ? "..." : bookings.length}</p>
          </div>
        </div>

        {/* Active booking */}
        <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1 mb-5">
          Current Stay
        </span>

        {loading ? (
          <p className="text-pencil">Loading...</p>
        ) : activeBooking ? (
          <div className="poster-border hard-shadow-sm rounded-2xl p-6 bg-paper flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="font-mono text-xs text-pencil">BOOKING #{String(activeBooking.id).padStart(4, "0")}</p>
              <p className="font-display text-lg text-ink mt-1">Room #{activeBooking.room_id}</p>
            </div>
            <span className="stamp-badge px-3 py-1.5 text-xs bg-marigold">{activeBooking.status}</span>
          </div>
        ) : (
          <div className="poster-border rounded-2xl p-8 bg-skytape text-center">
            <p className="font-display text-lg text-ink">NO ACTIVE BOOKINGS</p>
            <p className="text-pencil mt-2 mb-5">Find a hostel that fits your budget and move in.</p>
            <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
              Explore Hostels
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
