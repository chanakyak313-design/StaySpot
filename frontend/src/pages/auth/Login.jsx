import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, GraduationCap, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { loginUser, getCurrentUser, notifyAuthChanged } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSuccess = (user) => {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("role", user.role);
    localStorage.setItem("fullName", user.full_name);
    notifyAuthChanged();

    toast.success(`Welcome back, ${user.full_name}!`);

    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "owner") {
      navigate("/owner/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);
      localStorage.setItem("token", data.access_token);

      const user = await getCurrentUser();
      handleLoginSuccess(user);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const loginDemoAccount = async (email, password) => {
    setForm({ email, password });
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);

      const user = await getCurrentUser();
      handleLoginSuccess(user);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-skytape px-4 py-12 relative overflow-hidden">
      <div className="absolute top-16 left-[10%] w-3 h-3 rounded-full bg-coral border-2 border-ink hidden md:block" />
      <div className="absolute bottom-16 right-[12%] w-4 h-4 rounded-full bg-marigold border-2 border-ink hidden md:block" />

      <div className="w-full max-w-lg relative">
        <div className="pin-dot" />
        <div className="bg-paper poster-border hard-shadow rounded-2xl p-8 -rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-marigold border-2 border-ink">
              <LogIn size={16} className="text-ink" strokeWidth={2.5} />
            </span>
            <span className="stamp-badge px-3 py-1 text-xs bg-skytape">
              Welcome Back
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink mt-4">
            LOG IN
          </h1>
          <p className="text-pencil mt-2 text-sm">
            Pick up right where you left off, or use a 1-click demo account below.
          </p>

          {/* 1-Click Demo Accounts */}
          <div className="mt-6 p-4 rounded-xl poster-border bg-skytape/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-ink mb-3">
              <Sparkles size={14} className="text-coral" /> Quick 1-Click Demo Logins
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => loginDemoAccount("student@stayspot.demo", "demo1234")}
                className="btn-poster bg-paper text-ink p-2 text-xs text-center hard-shadow-sm flex flex-col items-center gap-1 hover:bg-mint transition-colors disabled:opacity-50"
              >
                <GraduationCap size={16} className="text-coral" />
                <span className="font-bold">Student</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => loginDemoAccount("owner@stayspot.demo", "demo1234")}
                className="btn-poster bg-paper text-ink p-2 text-xs text-center hard-shadow-sm flex flex-col items-center gap-1 hover:bg-marigold transition-colors disabled:opacity-50"
              >
                <Building2 size={16} className="text-marigold" />
                <span className="font-bold">Owner</span>
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => loginDemoAccount("admin@stayspot.demo", "demo1234")}
                className="btn-poster bg-paper text-ink p-2 text-xs text-center hard-shadow-sm flex flex-col items-center gap-1 hover:bg-coral hover:text-white transition-colors disabled:opacity-50"
              >
                <ShieldCheck size={16} className="text-mint" />
                <span className="font-bold">Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
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
                placeholder="••••••••"
                className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-poster w-full bg-marigold text-ink py-3.5 hard-shadow-sm disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to StaySpot"}
            </button>
          </form>

          <p className="text-center text-sm text-pencil mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-coral font-bold hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
