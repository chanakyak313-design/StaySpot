import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, MapPin, Trash2, Wifi, Utensils, Car, Star } from "lucide-react";
import { getAllHostels, deleteHostel } from "../../services/hostelService";
import { getDashboard } from "../../services/dashboardService";

function OwnerDashboard() {
  const [hostels, setHostels] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const ownerId = localStorage.getItem("userId");

  useEffect(() => {
    loadHostels();
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    if (!ownerId) return;
    try {
      const data = await getDashboard(ownerId);
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHostels = async () => {
    try {
      const all = await getAllHostels();
      setHostels(ownerId ? all.filter((h) => h.owner_id === Number(ownerId)) : all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hostel? This can't be undone.")) return;
    try {
      await deleteHostel(id);
      toast.success("Hostel deleted");
      loadHostels();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't delete hostel");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="font-display text-xl text-pencil">LOADING...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Hostels", value: stats.total_hostels || 0, bg: "bg-marigold" },
    { label: "Total Rooms", value: stats.total_rooms || 0, bg: "bg-mint" },
    { label: "Total Bookings", value: stats.total_bookings || 0, bg: "bg-skytape" },
    { label: "Revenue", value: `₹${(stats.revenue || 0).toLocaleString("en-IN")}`, bg: "bg-coral text-white" },
  ];

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2">
              Owner Control Room
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
              MY LISTINGS
            </h1>
          </div>
          <Link
            to="/owner/add-hostel"
            className="btn-poster bg-marigold text-ink px-6 py-3 hard-shadow-sm flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Hostel
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {statCards.map((s, i) => (
            <div key={i} className={`poster-border hard-shadow-sm rounded-2xl p-5 ${s.bg}`}>
              <p className="text-xs font-bold uppercase opacity-70 mb-1">{s.label}</p>
              <p className="font-display text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        {hostels.length === 0 ? (
          <div className="text-center py-20 poster-border rounded-2xl bg-skytape">
            <p className="font-display text-xl text-ink">NO HOSTELS YET</p>
            <p className="text-pencil mt-2 mb-6">Create your first listing to get started.</p>
            <Link to="/owner/add-hostel" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
              Create Hostel
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {hostels.map((hostel) => (
              <div key={hostel.id} className="poster-border hard-shadow-sm rounded-2xl p-6 bg-paper">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1 min-w-[240px]">
                    <h2 className="font-display text-xl text-ink">{hostel.hostel_name}</h2>
                    <p className="flex items-center gap-1.5 text-pencil mt-2 text-sm">
                      <MapPin size={14} /> {hostel.area}, {hostel.city}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {hostel.wifi && <span className="flex items-center gap-1 text-xs font-semibold bg-skytape px-2 py-1 rounded-full"><Wifi size={12}/> Wi-Fi</span>}
                      {hostel.food && <span className="flex items-center gap-1 text-xs font-semibold bg-mint px-2 py-1 rounded-full"><Utensils size={12}/> Food</span>}
                      {hostel.parking && <span className="flex items-center gap-1 text-xs font-semibold bg-skytape px-2 py-1 rounded-full"><Car size={12}/> Parking</span>}
                    </div>
                  </div>
                  <div className="stamp-badge flex items-center gap-1 px-3 py-1.5 text-xs bg-marigold">
                    <Star size={12} fill="currentColor" /> {hostel.rating || "New"}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-dashed border-ink/15 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link to={`/hostel/${hostel.id}`} className="btn-poster bg-skytape text-ink text-center py-2.5 text-sm">
                    View
                  </Link>
                  <Link to={`/owner/hostels/${hostel.id}/add-room`} className="btn-poster bg-mint text-ink text-center py-2.5 text-sm">
                    Add Room
                  </Link>
                  <Link to={`/hostel/${hostel.id}`} className="btn-poster bg-marigold text-ink text-center py-2.5 text-sm">
                    Manage Rooms
                  </Link>
                  <button
                    onClick={() => handleDelete(hostel.id)}
                    className="btn-poster bg-coral text-white py-2.5 text-sm flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
