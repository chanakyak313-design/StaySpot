import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Building2, Star } from "lucide-react";
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
    if (!window.confirm("Delete this hostel? This can't be undone.")) return;
    try {
      await deleteHostel(id);
      toast.success("Hostel deleted");
      loadHostels();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't delete hostel");
    }
  }

  if (forbidden) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center poster-border rounded-2xl bg-skytape p-10">
          <p className="font-display text-xl text-coral">ADMIN ACCESS ONLY</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-mint text-ink px-3 py-1 text-xs rotate-1 flex items-center gap-1.5 w-fit">
            <Building2 size={13} /> Admin Panel
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MANAGE HOSTELS
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16">LOADING...</p>
        ) : (
          <div className="space-y-3">
            {hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="poster-border hard-shadow-sm rounded-2xl p-5 bg-paper flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <p className="font-display text-base text-ink">{hostel.hostel_name}</p>
                  <p className="text-sm text-pencil mt-1">{hostel.area}, {hostel.city}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="stamp-badge flex items-center gap-1 px-3 py-1.5 text-xs bg-marigold">
                    <Star size={12} fill="currentColor" /> {hostel.rating || "New"}
                  </span>
                  <button
                    onClick={() => remove(hostel.id)}
                    className="btn-poster bg-coral text-white p-2.5 hard-shadow-sm"
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
