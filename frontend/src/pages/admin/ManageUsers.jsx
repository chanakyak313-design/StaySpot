import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Users } from "lucide-react";
import { getUsers, deleteUser } from "../../services/adminService";

const ROLE_STYLES = {
  owner: "bg-marigold text-ink",
  student: "bg-skytape text-ink",
  admin: "bg-coral text-white",
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
    if (!window.confirm("Delete this user? This can't be undone.")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      loadUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't delete user");
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
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2 flex items-center gap-1.5 w-fit">
            <Users size={13} /> Admin Panel
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MANAGE USERS
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16">LOADING...</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="poster-border hard-shadow-sm rounded-2xl p-5 bg-paper flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-skytape border-2 border-ink flex items-center justify-center font-display text-sm text-ink shrink-0">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{user.full_name}</p>
                    <p className="text-sm text-pencil font-mono">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`stamp-badge px-3 py-1.5 text-xs ${ROLE_STYLES[user.role] || "bg-skytape text-ink"}`}>
                    {user.role}
                  </span>
                  <button
                    onClick={() => remove(user.id)}
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
