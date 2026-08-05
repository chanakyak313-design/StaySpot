import { Link } from "react-router-dom";
import { DoorOpen } from "lucide-react";

function Booking() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-skytape px-4">
      <div className="text-center poster-border hard-shadow rounded-2xl bg-paper p-10 max-w-md">
        <div className="w-14 h-14 rounded-full bg-marigold border-2 border-ink flex items-center justify-center mx-auto mb-5">
          <DoorOpen size={24} className="text-ink" />
        </div>
        <p className="font-display text-xl text-ink">BOOK FROM A LISTING</p>
        <p className="text-pencil mt-2 mb-6">
          Bookings happen right from a hostel's page — pick your room and pay securely there.
        </p>
        <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
          Explore Hostels
        </Link>
      </div>
    </div>
  );
}

export default Booking;
