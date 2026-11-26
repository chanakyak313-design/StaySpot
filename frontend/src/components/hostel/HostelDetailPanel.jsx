import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getHostelById } from "../../services/hostelService";
import { getRooms } from "../../services/roomService";
import { getReviews, addReview } from "../../services/reviewService";
import { addFavorite } from "../../services/favoriteService";
import {
  MapPin,
  Wifi,
  Utensils,
  Car,
  Phone,
  Mail,
  Star,
  Heart,
  BadgeCheck,
  Shield,
  Zap,
  Shirt,
  Video,
  ArrowRight
} from "lucide-react";
import HostelMap from "../map/HostelMap";

const AMENITY_ICONS = {
  wifi: { icon: Wifi, label: "High-Speed Wi-Fi", bg: "bg-skytape" },
  food: { icon: Utensils, label: "Homely Mess Meals", bg: "bg-mint" },
  parking: { icon: Car, label: "Vehicle Parking", bg: "bg-skytape" },
  laundry: { icon: Shirt, label: "Washing & Laundry", bg: "bg-mint" },
  cctv: { icon: Video, label: "24/7 CCTV Security", bg: "bg-skytape" },
  power_backup: { icon: Zap, label: "Full Power Backup", bg: "bg-marigold" },
};

function HostelDetailPanel({ hostelId }) {
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [favorited, setFavorited] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadHostel();
    loadRooms();
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostelId]);

  const loadHostel = async () => {
    setLoading(true);
    try {
      const data = await getHostelById(hostelId);
      setHostel(data);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load hostel details.");
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      setRooms(await getRooms(hostelId));
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async () => {
    try {
      setReviews(await getReviews(hostelId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId) {
      toast.error("Please login to save this hostel to favorites.");
      return;
    }
    try {
      await addFavorite(userId, hostelId);
      setFavorited(true);
      toast.success("Added to your favorites! ❤️");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update favorites.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login to submit a review.");
      return;
    }

    try {
      await addReview(userId, hostelId, reviewForm.rating, reviewForm.comment);
      toast.success("Thank you for your review! ⭐");
      setReviewForm({ rating: 5, comment: "" });
      loadReviews();
      loadHostel();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't submit review");
    }
  };

  if (loading) {
    return (
      <div className="bg-paper min-h-[60vh] flex items-center justify-center">
        <p className="font-display text-xl text-pencil animate-pulse">LOADING HOSTEL DETAILS...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="bg-paper min-h-[60vh] flex items-center justify-center p-6">
        <div className="poster-border rounded-2xl p-8 bg-skytape text-center max-w-md">
          <p className="font-display text-xl text-ink">HOSTEL NOT FOUND</p>
          <Link to="/hostels" className="btn-poster inline-block mt-4 bg-marigold text-ink px-5 py-2.5">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage =
    hostel.images && hostel.images.length > 0
      ? hostel.images[0].image_url
      : "https://picsum.photos/seed/hostel/900/600";

  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* Hero Banner with Title & Actions */}
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-start gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="stamp-badge bg-mint text-ink px-3 py-1 text-xs flex items-center gap-1 font-bold">
                <BadgeCheck size={14} /> Verified Student Property
              </span>
              <span className="stamp-badge bg-marigold text-ink px-3 py-1 text-xs flex items-center gap-1 font-bold">
                <Star size={13} fill="currentColor" /> {hostel.rating || "4.8"} / 5
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white mt-4 tracking-tight">
              {hostel.hostel_name.toUpperCase()}
            </h1>
            <p className="text-white/80 flex items-center gap-2 mt-2 text-sm md:text-base">
              <MapPin size={16} className="text-coral shrink-0" />
              {hostel.address}, {hostel.area}, {hostel.city}
            </p>
          </div>

          {/* Quick Favorite Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFavoriteToggle}
              className={`btn-poster px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 transition-colors ${
                favorited ? "bg-coral text-white" : "bg-paper text-ink hover:text-coral"
              }`}
            >
              <Heart size={15} fill={favorited ? "currentColor" : "none"} strokeWidth={2.5} />
              {favorited ? "Saved in Favorites" : "Save Favorite"}
            </button>
            <a
              href="#rooms"
              className="btn-poster bg-marigold text-ink px-5 py-2.5 text-xs font-bold hard-shadow-sm flex items-center gap-1.5"
            >
              Book a Room <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-[340px] md:h-[420px] rounded-2xl overflow-hidden poster-border hard-shadow-sm relative">
            <img src={primaryImage} alt={hostel.hostel_name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 h-[340px] md:h-[420px]">
            {hostel.images && hostel.images.length > 1 ? (
              hostel.images.slice(1, 3).map((img, idx) => (
                <div key={idx} className="h-full rounded-2xl overflow-hidden poster-border relative">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <>
                <div className="h-full rounded-2xl overflow-hidden poster-border relative">
                  <img src="https://picsum.photos/seed/room1/600/400" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="h-full rounded-2xl overflow-hidden poster-border relative">
                  <img src="https://picsum.photos/seed/room2/600/400" alt="" className="w-full h-full object-cover" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Overview & Quick Info */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-8">
            {/* Description */}
            <div className="bg-paper poster-border hard-shadow-sm rounded-2xl p-8">
              <span className="stamp-badge bg-skytape text-ink px-3 py-1 text-xs mb-3 inline-block font-bold">
                About The Hostel
              </span>
              <h2 className="font-display text-2xl text-ink mb-4">
                PROPERTY OVERVIEW
              </h2>
              <p className="text-pencil font-medium leading-relaxed whitespace-pre-line text-base">
                {hostel.description || "A clean, secure, and student-friendly PG accommodation with all essential amenities included."}
              </p>

              {/* Amenities Grid */}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-ink/15">
                <h3 className="font-display text-sm text-ink uppercase mb-4 tracking-wider">
                  Verified Amenities Included
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(AMENITY_ICONS).map(([key, config]) => {
                    const available = hostel[key];
                    const Icon = config.icon;
                    return (
                      <div
                        key={key}
                        className={`poster-border rounded-xl p-3 flex items-center gap-2.5 ${
                          available ? `${config.bg} text-ink font-semibold` : "bg-paper/50 text-pencil/50 opacity-60"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="text-xs">{config.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Room Availability Section */}
            <div id="rooms" className="scroll-mt-24 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="stamp-badge bg-marigold text-ink px-3 py-1 text-xs font-bold inline-block">
                    Live Vacancy
                  </span>
                  <h2 className="font-display text-2xl text-ink mt-2">
                    AVAILABLE ROOMS & RATES
                  </h2>
                </div>
                <p className="text-xs text-pencil font-medium">
                  {rooms.length} Room Option{rooms.length === 1 ? "" : "s"} Available
                </p>
              </div>

              {rooms.length === 0 ? (
                <div className="poster-border rounded-2xl p-10 bg-skytape text-center">
                  <p className="font-display text-lg text-ink">NO ROOMS CURRENTLY LISTED</p>
                  <p className="text-pencil text-sm mt-1">Please check back soon or contact the warden directly.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-paper poster-border hard-shadow-sm rounded-2xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-display text-lg text-ink">
                            {room.room_type}
                          </h3>
                          <span
                            className={`stamp-badge text-[10px] px-2 py-0.5 font-bold ${
                              room.available_beds > 0 ? "bg-mint text-ink" : "bg-coral text-white"
                            }`}
                          >
                            {room.available_beds > 0 ? `${room.available_beds} Beds Free` : "Full"}
                          </span>
                        </div>

                        <p className="text-xs text-pencil mb-4">
                          Sharing Type: <span className="font-bold text-ink">{room.sharing_type}</span> • Total Capacity: {room.total_beds} Beds
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.ac && (
                            <span className="stamp-badge text-[10px] bg-skytape px-2 py-0.5 font-bold">
                              Air Conditioned
                            </span>
                          )}
                          {room.attached_bathroom && (
                            <span className="stamp-badge text-[10px] bg-mint px-2 py-0.5 font-bold">
                              Attached Bath
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t-2 border-dashed border-ink/15 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-pencil uppercase font-bold">Rent</p>
                          <p className="font-mono font-bold text-xl text-coral">
                            ₹{room.price.toLocaleString("en-IN")}<span className="text-xs font-sans text-pencil font-normal">/mo</span>
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/booking/${room.id}`)}
                          disabled={room.available_beds <= 0}
                          className={`btn-poster px-5 py-2.5 text-xs font-bold hard-shadow-sm ${
                            room.available_beds > 0
                              ? "bg-marigold text-ink hover:bg-mint transition-colors"
                              : "bg-pencil-light text-white opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {room.available_beds > 0 ? "Book Room" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Student Reviews Section */}
            <div className="bg-paper poster-border hard-shadow-sm rounded-2xl p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="stamp-badge bg-coral text-white px-3 py-1 text-xs font-bold inline-block">
                    Real Student Feedback
                  </span>
                  <h2 className="font-display text-2xl text-ink mt-2">
                    STUDENT REVIEWS ({reviews.length})
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-marigold font-display text-xl text-ink">
                  <Star size={18} fill="currentColor" className="text-marigold" />
                  {hostel.rating || "New"}
                </div>
              </div>

              {/* Write a review form */}
              <form onSubmit={handleReviewSubmit} className="bg-skytape/50 poster-border rounded-xl p-5 space-y-4">
                <h3 className="font-display text-sm text-ink uppercase">Add Your Review</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="text-xs font-bold uppercase text-pencil">Your Rating:</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    className="poster-border rounded-lg px-3 py-1.5 bg-paper font-bold text-xs"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{"⭐".repeat(r)} ({r} Stars)</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="How was your experience with the food, warden, WiFi, and rooms?..."
                  className="w-full poster-border rounded-xl p-3 text-sm font-medium bg-paper h-20 resize-none focus:outline-none focus:ring-2 focus:ring-marigold"
                  required
                />
                <button
                  type="submit"
                  className="btn-poster bg-ink text-white px-5 py-2.5 text-xs font-bold hard-shadow-sm"
                >
                  Submit Review
                </button>
              </form>

              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-pencil text-sm italic text-center py-6">
                    No reviews yet. Be the first to leave feedback for future students!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="poster-border rounded-xl p-4 bg-paper/60 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-ink">
                          {rev.user_name || `Verified Student #${rev.user_id}`}
                        </span>
                        <div className="flex text-marigold">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill="currentColor"
                              className={i < rev.rating ? "text-marigold" : "text-pencil-light"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-pencil leading-relaxed font-medium">
                        "{rev.review}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Location Map */}
          <div className="md:col-span-4 space-y-6">
            {/* Contact Card */}
            <div className="bg-paper poster-border hard-shadow rounded-2xl p-6 space-y-4">
              <span className="stamp-badge bg-mint text-ink text-xs px-2.5 py-1 font-bold inline-block">
                Direct Contact
              </span>
              <h3 className="font-display text-lg text-ink">
                HOSTEL WARDEN / DESK
              </h3>

              <div className="space-y-3 text-xs">
                {hostel.contact_number && (
                  <div className="flex items-center gap-2.5 font-medium text-ink">
                    <Phone size={15} className="text-coral shrink-0" />
                    <a href={`tel:${hostel.contact_number}`} className="hover:underline font-bold">
                      {hostel.contact_number}
                    </a>
                  </div>
                )}
                {hostel.email && (
                  <div className="flex items-center gap-2.5 font-medium text-ink truncate">
                    <Mail size={15} className="text-coral shrink-0" />
                    <a href={`mailto:${hostel.email}`} className="hover:underline">
                      {hostel.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Map Card */}
            {hostel.latitude && hostel.longitude ? (
              <div className="bg-paper poster-border hard-shadow rounded-2xl p-5 space-y-3">
                <span className="stamp-badge bg-skytape text-ink text-xs px-2.5 py-1 font-bold inline-block">
                  Location Pin
                </span>
                <h3 className="font-display text-base text-ink">
                  MAP VIEW
                </h3>
                <div className="h-64 rounded-xl overflow-hidden poster-border">
                  <HostelMap latitude={hostel.latitude} longitude={hostel.longitude} />
                </div>
                <p className="text-[11px] text-pencil">
                  {hostel.address}, {hostel.area}, {hostel.city}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostelDetailPanel;
