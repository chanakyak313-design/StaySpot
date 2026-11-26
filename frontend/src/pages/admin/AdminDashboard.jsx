import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Calendar, Star, IndianRupee, ShieldCheck, ArrowRight } from "lucide-react";
import { getDashboard } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, hostels: 0, bookings: 0, reviews: 0, revenue: 0 });
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
    { label: "Active Users", value: stats.users, icon: Users, bg: "bg-marigold" },
    { label: "Listed Hostels", value: stats.hostels, icon: Building2, bg: "bg-mint" },
    { label: "Total Bookings", value: stats.bookings, icon: Calendar, bg: "bg-skytape" },
    { label: "Platform Revenue", value: `₹${(stats.revenue || 0).toLocaleString("en-IN")}`, icon: IndianRupee, bg: "bg-coral text-white" },
  ];

  if (forbidden) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-skytape px-4">
        <div className="text-center poster-border hard-shadow rounded-2xl bg-paper p-10 max-w-md">
          <ShieldCheck size={36} className="mx-auto text-coral mb-3" />
          <h2 className="font-display text-2xl text-coral">ADMIN ACCESS ONLY</h2>
          <p className="text-pencil mt-2 mb-6 text-sm">
            You need an admin account to access the platform control room.
          </p>
          <Link to="/login" className="btn-poster inline-block bg-marigold text-ink px-6 py-2.5 hard-shadow-sm font-bold text-sm">
            Sign In As Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen pb-20">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1 font-bold">
              Superadmin Control Room
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
              SYSTEM DASHBOARD
            </h1>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/hostels" className="btn-poster bg-marigold text-ink px-4 py-2 text-xs font-bold hard-shadow-sm">
              Manage Hostels
            </Link>
            <Link to="/admin/users" className="btn-poster bg-mint text-ink px-4 py-2 text-xs font-bold hard-shadow-sm">
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16 animate-pulse">LOADING DASHBOARD METRICS...</p>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className={`poster-border hard-shadow-sm rounded-2xl p-6 ${c.bg}`}>
                    <Icon size={24} className="mb-3" />
                    <p className="text-xs font-bold uppercase opacity-80">{c.label}</p>
                    <p className="font-display text-3xl mt-1 tracking-tight">{c.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Management Nav */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="poster-border hard-shadow-sm rounded-2xl p-6 bg-paper flex flex-col justify-between">
                <div>
                  <span className="stamp-badge bg-mint text-ink text-xs px-2.5 py-1 font-bold inline-block mb-3">
                    Properties
                  </span>
                  <h3 className="font-display text-xl text-ink">Hostel Directory</h3>
                  <p className="text-pencil text-sm mt-1 leading-relaxed">
                    Review and moderate all registered hostels, inspect vacancy counts, addresses, and delete inactive listings.
                  </p>
                </div>
                <Link
                  to="/admin/hostels"
                  className="btn-poster bg-skytape text-ink px-5 py-2.5 text-xs font-bold hard-shadow-sm mt-6 self-start flex items-center gap-1.5"
                >
                  Manage Hostels <ArrowRight size={13} />
                </Link>
              </div>

              <div className="poster-border hard-shadow-sm rounded-2xl p-6 bg-paper flex flex-col justify-between">
                <div>
                  <span className="stamp-badge bg-marigold text-ink text-xs px-2.5 py-1 font-bold inline-block mb-3">
                    Accounts
                  </span>
                  <h3 className="font-display text-xl text-ink">User Directory</h3>
                  <p className="text-pencil text-sm mt-1 leading-relaxed">
                    View registered students, hostel owners, and administrators. Manage platform credentials and role permissions.
                  </p>
                </div>
                <Link
                  to="/admin/users"
                  className="btn-poster bg-marigold text-ink px-5 py-2.5 text-xs font-bold hard-shadow-sm mt-6 self-start flex items-center gap-1.5"
                >
                  Manage Users <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
