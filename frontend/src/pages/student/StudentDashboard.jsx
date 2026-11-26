import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Calendar, Search, Sparkles, MapPin, ExternalLink, ArrowRight } from "lucide-react";
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
    { to: "/favorites", label: "My Shortlist", icon: Heart, bg: "bg-coral text-white" },
    { to: "/my-bookings", label: "Booking History", icon: Calendar, bg: "bg-skytape" },
    { to: "/ai", label: "Ask StaySpot AI", icon: Sparkles, bg: "bg-mint" },
  ];

  return (
    <div className="bg-paper min-h-screen pb-20">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2 font-bold">
            Student Dashboard
          </span>
          <h1 className="font-display text-3xl md:text-5xl text-white mt-4">
            {fullName ? `HEY, ${fullName.split(" ")[0].toUpperCase()}!` : "WELCOME BACK!"}
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            Manage your hostel bookings, shortlisted rooms, and AI recommendations.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Quick links grid */}
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
                <span className="font-bold text-sm tracking-wide">{q.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Stats counter row */}
        <div className="grid grid-cols-2 gap-5 mb-12">
          <div className="poster-border hard-shadow-sm rounded-2xl p-6 bg-skytape">
            <p className="text-xs font-bold uppercase text-pencil mb-1">Favorites Saved</p>
            <p className="font-display text-4xl text-ink">{loading ? "..." : favoritesCount}</p>
            <Link to="/favorites" className="text-xs font-bold text-ink hover:text-coral flex items-center gap-1 mt-2">
              View Shortlist <ArrowRight size={12} />
            </Link>
          </div>
          <div className="poster-border hard-shadow-sm rounded-2xl p-6 bg-mint">
            <p className="text-xs font-bold uppercase text-pencil mb-1">Total Reservations</p>
            <p className="font-display text-4xl text-ink">{loading ? "..." : bookings.length}</p>
            <Link to="/my-bookings" className="text-xs font-bold text-ink hover:text-coral flex items-center gap-1 mt-2">
              View All Bookings <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Active / Current Stay */}
        <div className="space-y-4">
          <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1 font-bold">
            Current Stay
          </span>
          <h2 className="font-display text-2xl text-ink">ACTIVE RESERVATION</h2>

          {loading ? (
            <p className="text-pencil animate-pulse">Loading reservation...</p>
          ) : activeBooking ? (
            <div className="poster-border hard-shadow-sm rounded-2xl p-6 bg-paper flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden poster-border bg-skytape shrink-0">
                  <img
                    src={activeBooking.image_url || "https://picsum.photos/seed/hostel/200/200"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-pencil">REF #STAY-{String(activeBooking.id).padStart(4, "0")}</span>
                    <span className="stamp-badge px-2 py-0.5 text-[10px] bg-mint text-ink font-bold">{activeBooking.status}</span>
                  </div>
                  <h3 className="font-display text-lg text-ink mt-1">
                    {activeBooking.hostel_name}
                  </h3>
                  <p className="text-xs text-pencil flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-coral" />
                    {activeBooking.area}, {activeBooking.city} • {activeBooking.room_type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/hostel/${activeBooking.hostel_id}`}
                  className="btn-poster bg-skytape text-ink px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                >
                  <ExternalLink size={13} /> View Hostel
                </Link>
                <Link
                  to="/my-bookings"
                  className="btn-poster bg-marigold text-ink px-4 py-2 text-xs font-bold"
                >
                  Manage
                </Link>
              </div>
            </div>
          ) : (
            <div className="poster-border rounded-2xl p-8 bg-skytape text-center">
              <p className="font-display text-lg text-ink">NO ACTIVE STAY RIGHT NOW</p>
              <p className="text-pencil text-sm mt-1 mb-4">You have no upcoming or active hostel reservations.</p>
              <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-2.5 text-xs font-bold">
                Find Your Next Room
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
