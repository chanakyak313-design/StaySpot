import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { Home as HomeIcon, Sparkles, Building2, ShieldCheck, Heart, Calendar, PlusCircle, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import { logout, onAuthChanged } from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const syncAuth = () => {
      setFullName(localStorage.getItem("fullName"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", syncAuth);
    const unsubscribe = onAuthChanged(syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    setFullName(null);
    setRole(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `font-semibold transition-colors flex items-center gap-1.5 ${
      isActive(path) ? "text-coral font-bold underline underline-offset-4 decoration-2" : "text-ink hover:text-coral"
    }`;

  const renderNavLinks = () => {
    if (role === "admin") {
      return (
        <>
          <Link to="/hostels" className={linkClass("/hostels")}>
            Explore
          </Link>
          <Link to="/admin" className={linkClass("/admin")}>
            <ShieldCheck size={16} /> Admin Panel
          </Link>
          <Link to="/admin/hostels" className={linkClass("/admin/hostels")}>
            Manage Hostels
          </Link>
          <Link to="/admin/users" className={linkClass("/admin/users")}>
            Manage Users
          </Link>
          <Link to="/ai" className={linkClass("/ai")}>
            <Sparkles size={16} className="text-marigold" /> Ask AI
          </Link>
        </>
      );
    }

    if (role === "owner") {
      return (
        <>
          <Link to="/hostels" className={linkClass("/hostels")}>
            Explore
          </Link>
          <Link to="/owner/dashboard" className={linkClass("/owner/dashboard")}>
            <LayoutDashboard size={16} /> My Listings
          </Link>
          <Link to="/owner/add-hostel" className={linkClass("/owner/add-hostel")}>
            <PlusCircle size={16} /> Add Hostel
          </Link>
          <Link to="/ai" className={linkClass("/ai")}>
            <Sparkles size={16} className="text-marigold" /> Ask AI
          </Link>
        </>
      );
    }

    // Default / Student
    return (
      <>
        <Link to="/hostels" className={linkClass("/hostels")}>
          Explore
        </Link>
        {fullName && (
          <>
            <Link to="/favorites" className={linkClass("/favorites")}>
              <Heart size={15} /> Favorites
            </Link>
            <Link to="/my-bookings" className={linkClass("/my-bookings")}>
              <Calendar size={15} /> My Bookings
            </Link>
            <Link to="/student/dashboard" className={linkClass("/student/dashboard")}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
          </>
        )}
        <Link to="/owner/add-hostel" className={linkClass("/owner/add-hostel")}>
          List a Hostel
        </Link>
        <Link to="/ai" className={linkClass("/ai")}>
          <Sparkles size={16} className="text-marigold" /> Ask AI
        </Link>
      </>
    );
  };

  const getRoleBadge = () => {
    if (role === "admin") return { label: "Admin", bg: "bg-coral text-white" };
    if (role === "owner") return { label: "Owner", bg: "bg-marigold text-ink" };
    return { label: "Student", bg: "bg-mint text-ink" };
  };

  return (
    <nav className="sticky top-0 z-50 bg-paper border-b-[3px] border-ink">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-marigold border-2 border-ink group-hover:-rotate-6 transition-transform">
            <HomeIcon size={18} className="text-ink" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl text-ink tracking-tight">
            StaySpot
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {renderNavLinks()}

          {fullName ? (
            <div className="flex items-center gap-3 pl-3 border-l-2 border-ink/15">
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span className="stamp-badge px-3 py-1.5 text-xs bg-skytape -rotate-1 font-bold">
                  Hi, {fullName.split(" ")[0]}
                </span>
                <span className={`stamp-badge px-2 py-0.5 text-[10px] ${getRoleBadge().bg}`}>
                  {getRoleBadge().label}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-poster bg-paper text-ink px-4 py-2 text-xs hard-shadow-sm hover:hard-shadow-coral"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-2 border-l-2 border-ink/15">
              <Link
                to="/login"
                className="btn-poster bg-paper text-ink px-5 py-2 hard-shadow-sm text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-poster bg-marigold text-ink px-5 py-2 hard-shadow-sm text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-ink" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-paper border-t-2 border-ink animate-in slide-in-from-top duration-200">
          <div className="flex flex-col divide-y-2 divide-ink/10" onClick={() => setMenuOpen(false)}>
            <Link to="/hostels" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
              Explore Hostels
            </Link>

            {role === "admin" && (
              <>
                <Link to="/admin" className="block px-6 py-3.5 font-semibold hover:bg-skytape text-coral">
                  Admin Control Room
                </Link>
                <Link to="/admin/hostels" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  Manage Hostels
                </Link>
                <Link to="/admin/users" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  Manage Users
                </Link>
              </>
            )}

            {role === "owner" && (
              <>
                <Link to="/owner/dashboard" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  My Listings Dashboard
                </Link>
                <Link to="/owner/add-hostel" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  Add New Hostel
                </Link>
              </>
            )}

            {role !== "owner" && role !== "admin" && fullName && (
              <>
                <Link to="/student/dashboard" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  Student Dashboard
                </Link>
                <Link to="/favorites" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  My Favorites
                </Link>
                <Link to="/my-bookings" className="block px-6 py-3.5 font-semibold hover:bg-skytape">
                  My Bookings
                </Link>
              </>
            )}

            <Link to="/ai" className="block px-6 py-3.5 font-semibold hover:bg-skytape flex items-center gap-2">
              <Sparkles size={16} className="text-marigold" /> Ask StaySpot AI
            </Link>

            {fullName ? (
              <div className="p-6 bg-skytape/30 flex justify-between items-center">
                <Link to="/profile" className="font-bold text-ink">
                  Profile ({fullName.split(" ")[0]} - {role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-poster bg-coral text-white px-3 py-1.5 text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="p-6 flex gap-3">
                <Link to="/login" className="btn-poster flex-1 text-center bg-paper text-ink py-2 text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-poster flex-1 text-center bg-marigold text-ink py-2 text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
