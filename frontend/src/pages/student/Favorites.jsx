import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getFavorites, removeFavorite } from "../../services/favoriteService";
import { getHostelById } from "../../services/hostelService";
import { MapPin, Star, Trash2, Heart, ExternalLink, Wifi, Utensils, Car } from "lucide-react";

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-1", "rotate-2", "-rotate-2"];

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFavorites = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const favs = await getFavorites(userId);

      // Handle both cases: fav.hostel populated by backend or fallback to fetch
      const enriched = [];
      for (const fav of favs) {
        if (fav.hostel) {
          enriched.push(fav);
        } else {
          try {
            const h = await getHostelById(fav.hostel_id);
            enriched.push({ ...fav, hostel: h });
          } catch {
            enriched.push(fav);
          }
        }
      }
      setFavorites(enriched);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load your saved favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteId) => {
    try {
      await removeFavorite(favoriteId);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      toast.success("Removed from favorites");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from favorites");
    }
  };

  if (!userId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-skytape px-4">
        <div className="text-center poster-border hard-shadow rounded-2xl bg-paper p-10 max-w-md">
          <Heart size={32} className="mx-auto text-coral mb-3" />
          <h2 className="font-display text-2xl text-ink">PLEASE LOG IN</h2>
          <p className="text-pencil mt-2 mb-6 text-sm">
            Log in to view and manage your shortlisted hostels and PGs.
          </p>
          <Link to="/login" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm font-bold text-sm">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen pb-20">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1 font-bold">
              Saved For Later
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
              MY FAVORITES
            </h1>
          </div>
          <Link to="/hostels" className="btn-poster bg-marigold text-ink px-5 py-2.5 hard-shadow-sm text-sm">
            Explore More Hostels
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="font-display text-xl text-pencil animate-pulse">LOADING SAVED HOSTELS...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 poster-border rounded-2xl bg-skytape max-w-lg mx-auto">
            <Heart size={32} className="mx-auto text-pencil mb-2" />
            <h2 className="font-display text-xl text-ink">NO FAVORITES SHORTLISTED YET</h2>
            <p className="text-pencil mt-2 mb-6 text-sm px-6">
              When browsing, tap the heart icon on any hostel card to save it here for easy reference.
            </p>
            <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
              Explore Hostels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((favorite, i) => {
              const hostel = favorite.hostel;
              if (!hostel) return null;

              const minPrice = hostel.rooms?.length > 0
                ? Math.min(...hostel.rooms.map((r) => r.price))
                : null;

              const imageUrl = hostel.images?.length > 0
                ? hostel.images[0].image_url
                : "https://picsum.photos/seed/hostel/600/400";

              return (
                <div
                  key={favorite.id}
                  className={`relative bg-paper poster-border hard-shadow-sm rounded-2xl overflow-hidden ${
                    ROTATIONS[i % ROTATIONS.length]
                  } hover:rotate-0 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className="pin-dot" />

                  <div>
                    {/* Image Header */}
                    <div className="relative h-48 bg-skytape border-b-2 border-ink overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={hostel.hostel_name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemove(favorite.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper/90 border-2 border-ink flex items-center justify-center text-coral hover:bg-coral hover:text-white transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="absolute bottom-3 left-3 stamp-badge bg-marigold text-ink text-xs px-2.5 py-1 flex items-center gap-1 font-bold">
                        <Star size={12} fill="currentColor" /> {hostel.rating || "New"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display text-lg text-ink leading-tight">
                        {hostel.hostel_name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-pencil mt-1.5">
                        <MapPin size={13} className="text-coral" />
                        {hostel.area}, {hostel.city}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        {hostel.wifi && (
                          <span className="flex items-center gap-1 bg-skytape px-2 py-0.5 rounded-full font-medium">
                            <Wifi size={11} /> WiFi
                          </span>
                        )}
                        {hostel.food && (
                          <span className="flex items-center gap-1 bg-mint px-2 py-0.5 rounded-full font-medium">
                            <Utensils size={11} /> Food
                          </span>
                        )}
                        {hostel.parking && (
                          <span className="flex items-center gap-1 bg-skytape px-2 py-0.5 rounded-full font-medium">
                            <Car size={11} /> Parking
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Price & View */}
                  <div className="p-5 pt-0 border-t-2 border-dashed border-ink/15 mt-3 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-pencil uppercase font-bold">Starts at</p>
                      <p className="font-mono font-bold text-lg text-coral">
                        {minPrice ? `₹${minPrice.toLocaleString("en-IN")}` : "Contact"}
                        {minPrice ? <span className="text-xs text-pencil font-normal">/mo</span> : ""}
                      </p>
                    </div>

                    <Link
                      to={`/hostel/${hostel.id}`}
                      className="btn-poster bg-ink text-white px-4 py-2 text-xs hard-shadow-sm flex items-center gap-1"
                    >
                      <ExternalLink size={12} /> View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
