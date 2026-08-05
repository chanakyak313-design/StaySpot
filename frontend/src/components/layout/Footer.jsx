import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-ink text-white mt-24 border-t-[3px] border-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

        <div>
          <span className="font-display text-3xl text-marigold">
            StaySpot
          </span>
          <p className="mt-4 text-white/70 leading-7 max-w-xs">
            The notice board for finding your next hostel — verified
            listings, real prices, zero surprises.
          </p>
        </div>

        <div>
          <h3 className="stamp-badge inline-block px-3 py-1 text-xs bg-marigold text-ink mb-5 rotate-1">
            Quick Links
          </h3>
          <ul className="space-y-3 text-white/80 font-medium">
            <li><Link to="/" className="hover:text-marigold transition-colors">Home</Link></li>
            <li><Link to="/hostels" className="hover:text-marigold transition-colors">Explore Hostels</Link></li>
            <li><Link to="/my-bookings" className="hover:text-marigold transition-colors">My Bookings</Link></li>
            <li><Link to="/profile" className="hover:text-marigold transition-colors">Profile</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="stamp-badge inline-block px-3 py-1 text-xs bg-coral text-white mb-5 -rotate-1">
            Get In Touch
          </h3>
          <p className="text-white/70 font-mono text-sm">
            support@stayspot.com
          </p>
          <p className="text-white/70 mt-1">
            Hyderabad, India
          </p>
        </div>

      </div>

      <div className="border-t-2 border-white/10 py-6 text-center text-white/50 text-sm font-mono">
        © 2026 StaySpot — Made for students, by students.
      </div>
    </footer>
  );
}

export default Footer;
