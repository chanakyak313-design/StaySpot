import { Link } from "react-router-dom";
import { MapPin, Wifi, Utensils, Car, Star } from "lucide-react";

function HostelCard({ hostel, rotate = "rotate-0" }) {
  return (
    <div className={`relative bg-paper poster-border hard-shadow-sm rounded-2xl overflow-hidden ${rotate} hover:rotate-0 hover:-translate-y-1 transition-all duration-300`}>
      <div className="pin-dot" />

      <img
        src={
          hostel.images?.length > 0
            ? hostel.images[0].image_url
            : "https://placehold.co/600x400/EAF3FF/14213D?text=StaySpot"
        }
        alt={hostel.hostel_name}
        className="w-full h-52 object-cover border-b-2 border-ink"
      />

      <div className="p-6">
        <div className="flex justify-between items-start gap-2">
          <h2 className="font-display text-lg text-ink leading-tight">
            {hostel.hostel_name}
          </h2>

          <div className="stamp-badge flex items-center gap-1 text-xs px-2 py-1 bg-marigold shrink-0">
            <Star size={12} fill="currentColor" />
            {hostel.rating || "New"}
          </div>
        </div>

        <div className="flex items-center text-pencil mt-2 text-sm">
          <MapPin size={15} />
          <span className="ml-1.5">
            {hostel.area}, {hostel.city}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {hostel.wifi && (
            <span className="flex items-center gap-1 text-ink text-xs font-semibold bg-skytape px-2 py-1 rounded-full">
              <Wifi size={13} /> Wi-Fi
            </span>
          )}
          {hostel.food && (
            <span className="flex items-center gap-1 text-ink text-xs font-semibold bg-mint px-2 py-1 rounded-full">
              <Utensils size={13} /> Food
            </span>
          )}
          {hostel.parking && (
            <span className="flex items-center gap-1 text-ink text-xs font-semibold bg-skytape px-2 py-1 rounded-full">
              <Car size={13} /> Parking
            </span>
          )}
        </div>

        <div className="mt-5 pt-5 border-t-2 border-dashed border-ink/15 flex justify-between items-center">
          <div>
            <p className="text-xs text-pencil font-medium">Starting from</p>
            <h3 className="font-mono font-bold text-2xl text-coral">
              ₹{hostel.rooms?.length > 0
                ? Math.min(...hostel.rooms.map((room) => room.price)).toLocaleString("en-IN")
                : "--"}
            </h3>
          </div>

          <Link
            to={`/hostel/${hostel.id}`}
            className="btn-poster bg-ink text-white px-4 py-2.5 text-sm hard-shadow-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HostelCard;
