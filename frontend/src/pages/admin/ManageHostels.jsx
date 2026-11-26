import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, Building2, Star, ExternalLink, ArrowLeft } from "lucide-react";
import { getHostels, deleteHostel } from "../../services/adminService";

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    loadHostels();
  }, []);

  async function loadHostels() {
    try {
      const data = await getHostels();
      setHostels(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setForbidden(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Are you sure you want to permanently delete this hostel?")) return;
    try {
      await deleteHostel(id);
      toast.success("Hostel listing deleted");
      loadHostels();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't delete hostel");
    }
  }

  if (forbidden) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-skytape px-4">
        <div className="text-center poster-border rounded-2xl bg-paper p-10 max-w-md">
          <p className="font-display text-xl text-coral">ADMIN ACCESS ONLY</p>
          <p className="text-pencil mt-2 text-sm">Please log in with admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen pb-20">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            to="/admin"
            className="text-white/70 hover:text-white flex items-center gap-1.5 text-xs font-bold uppercase mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Admin Dashboard
          </Link>
          <span className="stamp-badge inline-block bg-mint text-ink px-3 py-1 text-xs rotate-1 flex items-center gap-1.5 w-fit font-bold">
            <Building2 size={13} /> Admin Panel
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MANAGE HOSTELS ({hostels.length})
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16 animate-pulse">LOADING LISTINGS...</p>
        ) : hostels.length === 0 ? (
          <div className="text-center py-16 poster-border rounded-2xl bg-skytape">
            <p className="font-display text-lg text-ink">NO HOSTELS FOUND</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="poster-border hard-shadow-sm rounded-2xl p-5 bg-paper flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg text-ink">{hostel.hostel_name}</p>
                    <span className="stamp-badge flex items-center gap-1 px-2 py-0.5 text-[10px] bg-marigold font-bold">
                      <Star size={11} fill="currentColor" /> {hostel.rating || "New"}
                    </span>
                  </div>
                  <p className="text-sm text-pencil mt-1">
                    {hostel.address ? `${hostel.address}, ` : ""}{hostel.area}, {hostel.city}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/hostel/${hostel.id}`}
                    className="btn-poster bg-skytape text-ink px-3.5 py-2 text-xs font-bold flex items-center gap-1"
                  >
                    <ExternalLink size={13} /> View Page
                  </Link>
                  <button
                    onClick={() => remove(hostel.id)}
                    className="btn-poster bg-coral text-white p-2.5 hard-shadow-sm hover:opacity-90"
                    title="Delete Hostel"
                  >
                    <Trash2 size={15} />
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
