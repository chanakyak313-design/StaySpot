import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { Home as HomeIcon } from "lucide-react";
import toast from "react-hot-toast";
import { logout, onAuthChanged } from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullName, setFullName] = useState(localStorage.getItem("fullName"));

  useEffect(() => {
    const syncAuth = () => setFullName(localStorage.getItem("fullName"));
    window.addEventListener("storage", syncAuth); // other tabs
    const unsubscribe = onAuthChanged(syncAuth); // this tab
    return () => {
      window.removeEventListener("storage", syncAuth);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    setFullName(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const linkClass =
    "font-semibold text-ink hover:text-coral transition-colors";

  const navLinks = (
    <>
      <Link to="/hostels" className={linkClass}>
        Explore
      </Link>
      <Link to="/favorites" className={linkClass}>
        Favorites
      </Link>
      <Link to="/my-bookings" className={linkClass}>
        My Bookings
      </Link>
      <Link to="/owner/add-hostel" className={linkClass}>
        List a Hostel
      </Link>
      <Link to="/ai" className={linkClass}>
        Ask AI
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-paper border-b-[3px] border-ink">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-marigold border-2 border-ink group-hover:-rotate-6 transition-transform">
            <HomeIcon size={18} className="text-ink" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl text-ink">
            StaySpot
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks}

          {fullName ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="stamp-badge px-4 py-2 text-xs bg-skytape -rotate-2"
              >
                Hi, {fullName.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="btn-poster bg-paper text-ink px-5 py-2.5 hard-shadow-sm hover:hard-shadow-coral"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="btn-poster bg-paper text-ink px-5 py-2.5 hard-shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-poster bg-marigold text-ink px-5 py-2.5 hard-shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button className="lg:hidden text-ink" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-paper border-t-2 border-ink">
          <div className="flex flex-col divide-y-2 divide-ink/10">
            <Link to="/hostels" className="block px-6 py-4 font-semibold hover:bg-skytape">
              Explore
            </Link>
            <Link to="/favorites" className="block px-6 py-4 font-semibold hover:bg-skytape">
              Favorites
            </Link>
            <Link to="/my-bookings" className="block px-6 py-4 font-semibold hover:bg-skytape">
              My Bookings
            </Link>
            <Link to="/owner/add-hostel" className="block px-6 py-4 font-semibold hover:bg-skytape">
              List a Hostel
            </Link>
            <Link to="/ai" className="block px-6 py-4 font-semibold hover:bg-skytape">
              Ask AI
            </Link>

            {fullName ? (
              <>
                <Link to="/profile" className="block px-6 py-4 font-semibold hover:bg-skytape">
                  Hi, {fullName.split(" ")[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-6 py-4 font-semibold text-coral hover:bg-skytape"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-6 py-4 font-semibold hover:bg-skytape">
                  Login
                </Link>
                <Link to="/register" className="block px-6 py-4 font-semibold hover:bg-skytape">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
