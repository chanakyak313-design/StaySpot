import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2, Users, ArrowLeft } from "lucide-react";
import { getUsers, deleteUser } from "../../services/adminService";

const ROLE_STYLES = {
  owner: "bg-marigold text-ink font-bold",
  student: "bg-skytape text-ink font-bold",
  admin: "bg-coral text-white font-bold",
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
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
    if (!window.confirm("Are you sure you want to delete this user? All their data will be removed.")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't delete user");
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
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs rotate-1 flex items-center gap-1.5 w-fit font-bold">
            <Users size={13} /> Admin Panel
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MANAGE USERS ({users.length})
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16 animate-pulse">LOADING USERS...</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="poster-border hard-shadow-sm rounded-2xl p-5 bg-paper flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="font-display text-lg text-ink">{user.full_name}</p>
                    <span className={`stamp-badge px-2.5 py-0.5 text-[10px] uppercase ${ROLE_STYLES[user.role] || "bg-skytape text-ink"}`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-pencil mt-1">
                    {user.email} • {user.phone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => remove(user.id)}
                    className="btn-poster bg-coral text-white p-2.5 hard-shadow-sm hover:opacity-90"
                    title="Delete User"
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
