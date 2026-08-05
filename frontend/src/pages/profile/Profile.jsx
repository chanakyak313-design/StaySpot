import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User as UserIcon, Mail, Phone, Save } from "lucide-react";
import { getProfile, updateProfile } from "../../services/profileService";

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile(userId);
      setUser(data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setSaving(true);
    try {
      const updated = await updateProfile(userId, {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      });
      localStorage.setItem("fullName", updated.full_name);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (!localStorage.getItem("userId")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center poster-border rounded-2xl bg-skytape p-10">
          <p className="font-display text-xl text-ink">PLEASE LOGIN</p>
          <p className="text-pencil mt-2">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-2xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2">
            Your ID Card
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MY PROFILE
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16">LOADING...</p>
        ) : (
          <div className="bg-paper poster-border hard-shadow rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b-2 border-dashed border-ink/15">
              <div className="w-16 h-16 rounded-full bg-marigold border-2 border-ink flex items-center justify-center font-display text-2xl text-ink">
                {(user.full_name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-display text-xl text-ink">{user.full_name}</p>
                <span className="stamp-badge inline-block text-xs px-2 py-1 bg-skytape mt-1">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase text-pencil flex items-center gap-1.5 mb-2">
                  <UserIcon size={14} /> Full Name
                </label>
                <input
                  className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
                  value={user.full_name || ""}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-pencil flex items-center gap-1.5 mb-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-pencil flex items-center gap-1.5 mb-2">
                  <Phone size={14} /> Phone
                </label>
                <input
                  className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
                  value={user.phone || ""}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="btn-poster w-full bg-marigold text-ink py-3.5 hard-shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
