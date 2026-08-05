import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Calendar, Star } from "lucide-react";
import { getDashboard } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, hostels: 0, bookings: 0, reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setForbidden(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    { label: "Users", value: stats.users, icon: Users, bg: "bg-marigold" },
    { label: "Hostels", value: stats.hostels, icon: Building2, bg: "bg-mint" },
    { label: "Bookings", value: stats.bookings, icon: Calendar, bg: "bg-skytape" },
    { label: "Reviews", value: stats.reviews, icon: Star, bg: "bg-coral text-white" },
  ];

  if (forbidden) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center poster-border rounded-2xl bg-skytape p-10">
          <p className="font-display text-xl text-coral">ADMIN ACCESS ONLY</p>
          <p className="text-pencil mt-2">You need an admin account to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1">
            Admin Panel
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            CONTROL ROOM
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16">LOADING...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className={`poster-border hard-shadow-sm rounded-2xl p-6 ${c.bg}`}>
                    <Icon size={24} className="mb-3" />
                    <p className="text-xs font-bold uppercase opacity-70">{c.label}</p>
                    <p className="font-display text-3xl mt-1">{c.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/admin/users" className="btn-poster bg-marigold text-ink px-6 py-3 hard-shadow-sm">
                Manage Users
              </Link>
              <Link to="/admin/hostels" className="btn-poster bg-ink text-white px-6 py-3 hard-shadow-sm">
                Manage Hostels
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
