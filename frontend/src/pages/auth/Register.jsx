import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { registerUser } from "../../services/authService";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-skytape px-4 py-12 relative overflow-hidden">
      <div className="absolute top-16 right-[10%] w-3 h-3 rounded-full bg-coral border-2 border-ink hidden md:block" />
      <div className="absolute bottom-16 left-[12%] w-4 h-4 rounded-full bg-marigold border-2 border-ink hidden md:block" />

      <div className="w-full max-w-md relative">
        <div className="pin-dot" />
        <div className="bg-paper poster-border hard-shadow rounded-2xl p-8 rotate-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-coral border-2 border-ink">
              <UserPlus size={16} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="stamp-badge px-3 py-1 text-xs bg-skytape">
              Join the Board
            </span>
          </div>

          <h1 className="font-display text-3xl text-ink mt-4">
            SIGN UP
          </h1>
          <p className="text-pencil mt-2">
            Create an account to book or list a hostel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
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
                placeholder="Jane Doe"
                className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>

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
                Phone
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
                minLength={6}
                placeholder="••••••••"
                className="w-full poster-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "student" })}
                  className={`btn-poster py-3 text-sm ${
                    form.role === "student"
                      ? "bg-marigold text-ink hard-shadow-sm"
                      : "bg-paper text-pencil"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "owner" })}
                  className={`btn-poster py-3 text-sm ${
                    form.role === "owner"
                      ? "bg-marigold text-ink hard-shadow-sm"
                      : "bg-paper text-pencil"
                  }`}
                >
                  Hostel Owner
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-poster w-full bg-ink text-white py-3.5 hard-shadow-coral disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-pencil mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-coral font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
