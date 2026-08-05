import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getFavorites, removeFavorite } from "../../services/favoriteService";
import { getHostelById } from "../../services/hostelService";
import { MapPin, Star, Trash2 } from "lucide-react";

const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-1", "rotate-2", "-rotate-2"];

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [hostelDetails, setHostelDetails] = useState({});
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
      setFavorites(favs);

      const details = {};
      for (const fav of favs) {
        details[fav.hostel_id] = await getHostelById(fav.hostel_id);
      }
      setHostelDetails(details);
    } catch (err) {
      console.error(err);
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center poster-border rounded-2xl bg-skytape p-10">
          <p className="font-display text-xl text-ink">PLEASE LOGIN</p>
          <p className="text-pencil mt-2">Login to see your saved hostels.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-6xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1">
            Saved For Later
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MY FAVORITES
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16">LOADING...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 poster-border rounded-2xl bg-skytape">
            <p className="font-display text-xl text-ink">NO FAVORITES YET</p>
            <p className="text-pencil mt-2 mb-6">Save hostels you like for quick access later.</p>
            <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
              Explore Hostels
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {favorites.map((favorite, i) => {
              const hostel = hostelDetails[favorite.hostel_id];
              if (!hostel) return null;

              return (
                <div
                  key={favorite.id}
                  className={`relative bg-paper poster-border hard-shadow-sm rounded-2xl overflow-hidden ${ROTATIONS[i % ROTATIONS.length]} hover:rotate-0 transition-transform`}
                >
                  <div className="pin-dot" />

                  <div className="relative h-48 border-b-2 border-ink">
                    {hostel.images && hostel.images.length > 0 ? (
                      <img
                        src={hostel.images[0].image_url}
                        alt={hostel.hostel_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-skytape text-pencil font-medium">
                        No Image
                      </div>
                    )}
                    <button
                      onClick={() => handleRemove(favorite.id)}
                      className="absolute top-3 right-3 bg-coral text-white p-2 rounded-full border-2 border-ink hover:scale-110 transition-transform"
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h2 className="font-display text-lg text-ink leading-tight">
                        {hostel.hostel_name}
                      </h2>
                      <div className="stamp-badge flex items-center gap-1 text-xs px-2 py-1 bg-marigold shrink-0">
                        <Star size={12} fill="currentColor" />
                        {hostel.rating || "New"}
                      </div>
                    </div>

                    <div className="flex items-center text-pencil text-sm mb-4">
                      <MapPin size={15} />
                      <span className="ml-1.5">{hostel.area}, {hostel.city}</span>
                    </div>

                    {hostel.rooms && hostel.rooms.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-pencil font-medium">Starting from</p>
                        <p className="font-mono font-bold text-xl text-coral">
                          ₹{Math.min(...hostel.rooms.map((room) => room.price)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}

                    <Link
                      to={`/hostel/${hostel.id}`}
                      className="btn-poster block w-full text-center bg-ink text-white px-4 py-2.5 text-sm hard-shadow-sm"
                    >
                      View Details
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
