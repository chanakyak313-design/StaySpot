import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Wifi, Utensils, Car, Star, BadgeCheck, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { addFavorite } from "../../services/favoriteService";

function HostelCard({ hostel, rotate = "rotate-0", onSelect }) {
  const [favorited, setFavorited] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId) {
      toast.error("Please login to save favorites.");
      return;
    }

    try {
      await addFavorite(userId, hostel.id);
      setFavorited(true);
      toast.success("Saved to your favorites! ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save to favorites.");
    }
  };

  const startingPrice = hostel.rooms?.length > 0
    ? Math.min(...hostel.rooms.map((room) => room.price))
    : null;

  return (
    <div className={`relative bg-paper poster-border hard-shadow-sm rounded-2xl overflow-hidden ${rotate} hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}>
      <div className="pin-dot" />

      <div>
        <div className="relative">
          <img
            src={
              hostel.images?.length > 0
                ? hostel.images[0].image_url
                : "https://placehold.co/600x400/EAF3FF/14213D?text=StaySpot"
            }
            alt={hostel.hostel_name}
            className="w-full h-52 object-cover border-b-2 border-ink"
          />
          <span className="stamp-badge absolute top-3 left-3 flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-mint -rotate-2 font-bold">
            <BadgeCheck size={12} /> Verified
          </span>

          {/* Quick Favorite Heart Button */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            title={favorited ? "Saved to Favorites" : "Save to Favorites"}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center transition-all ${
              favorited ? "bg-coral text-white scale-110" : "bg-paper/90 text-ink hover:text-coral hover:bg-white"
            }`}
          >
            <Heart size={15} fill={favorited ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start gap-2">
            <h2 className="font-display text-lg text-ink leading-tight">
              {hostel.hostel_name}
            </h2>

            <div className="stamp-badge flex items-center gap-1 text-xs px-2 py-1 bg-marigold shrink-0 font-bold">
              <Star size={12} fill="currentColor" />
              {hostel.rating || "4.8"}
            </div>
          </div>

          <div className="flex items-center text-pencil mt-2 text-sm">
            <MapPin size={15} className="text-coral shrink-0" />
            <span className="ml-1.5 font-medium truncate">
              {hostel.area}, {hostel.city}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {hostel.wifi && (
              <span className="flex items-center gap-1 text-ink text-xs font-semibold bg-skytape px-2.5 py-1 rounded-full">
                <Wifi size={13} /> Wi-Fi
              </span>
            )}
            {hostel.food && (
              <span className="flex items-center gap-1 text-ink text-xs font-semibold bg-mint px-2.5 py-1 rounded-full">
                <Utensils size={13} /> Food
              </span>
            )}
            {hostel.parking && (
              <span className="flex items-center gap-1 text-ink text-xs font-semibold bg-skytape px-2.5 py-1 rounded-full">
                <Car size={13} /> Parking
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="pt-4 border-t-2 border-dashed border-ink/15 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-pencil uppercase font-bold tracking-wider">Starting from</p>
            <h3 className="font-mono font-bold text-2xl text-coral">
              {startingPrice ? `₹${startingPrice.toLocaleString("en-IN")}` : "Contact"}
              {startingPrice && <span className="text-xs text-pencil font-normal font-sans">/mo</span>}
            </h3>
          </div>

          {onSelect ? (
            <button
              onClick={() => onSelect(hostel.id)}
              className="btn-poster bg-ink text-white px-5 py-2.5 text-xs font-bold hard-shadow-sm hover:hard-shadow-coral"
            >
              View Room
            </button>
          ) : (
            <Link
              to={`/hostel/${hostel.id}`}
              className="btn-poster bg-ink text-white px-5 py-2.5 text-xs font-bold hard-shadow-sm hover:hard-shadow-coral"
            >
              View Room
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HostelCard;
