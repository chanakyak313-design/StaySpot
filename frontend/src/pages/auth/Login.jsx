import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import { loginUser, getCurrentUser, notifyAuthChanged } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);
      localStorage.setItem("token", data.access_token);

      const user = await getCurrentUser();
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("fullName", user.full_name);
      notifyAuthChanged();

      toast.success(`Welcome back, ${user.full_name}!`);

      if (user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-skytape px-4 py-12 relative overflow-hidden">
      <div className="absolute top-16 left-[10%] w-3 h-3 rounded-full bg-coral border-2 border-ink hidden md:block" />
      <div className="absolute bottom-16 right-[12%] w-4 h-4 rounded-full bg-marigold border-2 border-ink hidden md:block" />

      <div className="w-full max-w-md relative">
        <div className="pin-dot" />
        <div className="bg-paper poster-border hard-shadow rounded-2xl p-8 -rotate-1">
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
          <p className="text-pencil mt-2">
            Pick up right where you left off.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-pencil mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-coral font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
