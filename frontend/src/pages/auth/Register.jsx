import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus, GraduationCap, Building2 } from "lucide-react";
import { registerUser, loginUser, getCurrentUser, notifyAuthChanged } from "../../services/authService";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(form);

      const data = await loginUser(form.email, form.password);
      localStorage.setItem("token", data.access_token);

      const user = await getCurrentUser();
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("fullName", user.full_name);
      notifyAuthChanged();

      toast.success(`Welcome to StaySpot, ${user.full_name}!`);

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-skytape px-4 py-12 relative overflow-hidden">
      <div className="absolute top-16 right-[10%] w-3 h-3 rounded-full bg-coral border-2 border-ink hidden md:block" />
      <div className="absolute bottom-16 left-[12%] w-4 h-4 rounded-full bg-marigold border-2 border-ink hidden md:block" />

      <div className="w-full max-w-lg relative">
        <div className="pin-dot" />
        <div className="bg-paper poster-border hard-shadow rounded-2xl p-8 rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-coral border-2 border-ink">
              <UserPlus size={16} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="stamp-badge px-3 py-1 text-xs bg-skytape">
              Join the Board
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink mt-4">
            CREATE ACCOUNT
          </h1>
          <p className="text-pencil mt-2 text-sm">
            Sign up to discover, bookmark, book, or list student hostels.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {/* Account Type Selector */}
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("student")}
                  className={`poster-border rounded-xl p-3 text-left transition-all flex items-center gap-2.5 ${
                    form.role === "student"
                      ? "bg-marigold hard-shadow-sm text-ink font-bold"
                      : "bg-paper text-pencil hover:bg-skytape"
                  }`}
                >
                  <GraduationCap size={18} />
                  <div>
                    <div className="text-xs font-bold uppercase">Student</div>
                    <div className="text-[10px] opacity-80">Finding a PG / Hostel</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("owner")}
                  className={`poster-border rounded-xl p-3 text-left transition-all flex items-center gap-2.5 ${
                    form.role === "owner"
                      ? "bg-marigold hard-shadow-sm text-ink font-bold"
                      : "bg-paper text-pencil hover:bg-skytape"
                  }`}
                >
                  <Building2 size={18} />
                  <div>
                    <div className="text-xs font-bold uppercase">Hostel Owner</div>
                    <div className="text-[10px] opacity-80">Listing properties</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="Ananya Rao"
                className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-pencil block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="ananya@example.com"
                  className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-pencil block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="9876543210"
                  className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="At least 6 characters"
                className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-poster w-full bg-marigold text-ink py-3.5 hard-shadow-sm disabled:opacity-60 mt-2"
            >
              {loading ? "Creating account..." : "Join StaySpot"}
            </button>
          </form>

          <p className="text-center text-sm text-pencil mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-coral font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
