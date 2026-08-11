import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getHostelById } from "../../services/hostelService";
import { getRooms } from "../../services/roomService";
import { createBooking, downloadReceipt } from "../../services/bookingService";
import { getReviews, addReview } from "../../services/reviewService";
import { addFavorite } from "../../services/favoriteService";
import { MapPin, Wifi, Utensils, Car, Phone, Mail, Star, Heart, BadgeCheck } from "lucide-react";
import HostelMap from "../map/HostelMap";

const AMENITY_ICONS = {
  wifi: { icon: Wifi, label: "Wi-Fi", bg: "bg-skytape" },
  food: { icon: Utensils, label: "Food", bg: "bg-mint" },
  parking: { icon: Car, label: "Parking", bg: "bg-skytape" },
};

/**
 * Renders a hostel's full details, rooms, booking, reviews, and map.
 * Used both as the standalone /hostel/:id page (for direct/shareable
 * links) and inline within the Explore page, so booking and every other
 * action can happen right where a hostel was selected - no separate
 * page-to-page navigation required.
 */
function HostelDetailPanel({ hostelId }) {
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

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

  const handleBooking = async (roomId) => {
    try {
      const bookingResponse = await createBooking({ room_id: roomId });

      toast.success("Booking confirmed!");

      if (window.confirm("Download your receipt now?")) {
        await downloadReceipt(bookingResponse.id);
      }

      loadRooms();
    } catch (err) {
      console.error(err);
      toast.error("Booking failed: " + (err.response?.data?.detail || "Please try again"));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login to submit a review.");
      return;
    }

    try {
      await addReview(userId, hostelId, reviewForm.rating, reviewForm.comment);
      toast.success("Review submitted!");
      setReviewForm({ rating: 5, comment: "" });
      loadReviews();
      loadHostel();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't submit review");
    }
  };

  const handleFavorite = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to save favorites.");
      return;
    }

    try {
      await addFavorite(userId, hostel.id);
      toast.success("Added to Favorites!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't add to favorites");
    }
  };

  if (loading) {
    return (
      <div className="bg-paper animate-pulse">
        <div className="w-full h-[400px] bg-skytape border-b-[3px] border-ink" />
        <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">
          <div className="bg-paper poster-border hard-shadow rounded-2xl p-8 mb-10">
            <div className="h-8 bg-skytape rounded-full w-2/3 mb-4" />
            <div className="h-4 bg-skytape rounded-full w-1/3" />
          </div>
          <div className="h-4 bg-skytape rounded-full w-full max-w-2xl mb-3" />
          <div className="h-4 bg-skytape rounded-full w-full max-w-xl mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 bg-skytape rounded-2xl poster-border" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="text-center poster-border rounded-2xl bg-skytape p-10">
          <p className="font-display text-xl text-coral">HOSTEL NOT FOUND</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      {/* Hero image */}
      <div className="border-b-[3px] border-ink">
        {hostel.images && hostel.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[480px] overflow-hidden">
            <img
              src={hostel.images[0].image_url}
              alt={hostel.hostel_name}
              className="w-full h-[480px] object-cover"
            />
            <div className="hidden md:grid grid-cols-2 gap-1">
              {hostel.images.slice(1, 5).map((img, idx) => (
                <img
                  key={idx}
                  src={img.image_url}
                  alt={`${hostel.hostel_name} ${idx}`}
                  className="w-full h-[238px] object-cover"
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src="https://placehold.co/1200x480/EAF3FF/14213D?text=StaySpot"
            alt={hostel.hostel_name}
            className="w-full h-[400px] object-cover"
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-10">

        {/* Header card */}
        <div className="bg-paper poster-border hard-shadow rounded-2xl p-8 mb-10">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex-1 min-w-[240px]">
              <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                {hostel.hostel_name.toUpperCase()}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <span className="stamp-badge flex items-center gap-1 px-3 py-1.5 text-xs bg-marigold">
                  <Star size={13} fill="currentColor" /> {hostel.rating || "New"}
                </span>
                <span className="stamp-badge flex items-center gap-1 px-3 py-1.5 text-xs bg-mint">
                  <BadgeCheck size={13} /> Verified Listing
                </span>
                <div className="flex items-center gap-1.5 text-pencil">
                  <MapPin size={17} />
                  <span className="font-medium">{hostel.area}, {hostel.city}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleFavorite}
              className="btn-poster bg-coral text-white px-6 py-3 hard-shadow-sm flex items-center gap-2"
            >
              <Heart size={18} />
              Save
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <span className="stamp-badge inline-block bg-skytape px-3 py-1 text-xs -rotate-1 mb-4">
            About This Place
          </span>
          <p className="text-pencil leading-relaxed text-lg max-w-3xl">
            {hostel.description}
          </p>
        </div>

        {/* Amenities */}
        <div className="mb-10">
          <span className="stamp-badge inline-block bg-mint px-3 py-1 text-xs rotate-1 mb-5">
            Amenities
          </span>
          <div className="flex flex-wrap gap-3">
            {["wifi", "food", "parking"].filter((k) => hostel[k]).map((k) => {
              const { icon: Icon, label, bg } = AMENITY_ICONS[k];
              return (
                <div key={k} className={`flex items-center gap-2 px-4 py-3 poster-border rounded-xl ${bg}`}>
                  <Icon className="text-ink" size={20} />
                  <span className="font-semibold text-ink">{label}</span>
                </div>
              );
            })}
            {hostel.laundry && (
              <div className="flex items-center gap-2 px-4 py-3 poster-border rounded-xl bg-skytape">
                <span>🧺</span><span className="font-semibold text-ink">Laundry</span>
              </div>
            )}
            {hostel.cctv && (
              <div className="flex items-center gap-2 px-4 py-3 poster-border rounded-xl bg-mint">
                <span>📹</span><span className="font-semibold text-ink">CCTV</span>
              </div>
            )}
            {hostel.power_backup && (
              <div className="flex items-center gap-2 px-4 py-3 poster-border rounded-xl bg-skytape">
                <span>⚡</span><span className="font-semibold text-ink">Power Backup</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="poster-border rounded-2xl p-8 mb-10 bg-skytape">
          <span className="stamp-badge inline-block bg-paper px-3 py-1 text-xs mb-5">
            Contact
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="text-coral" size={22} />
              <div>
                <p className="text-xs text-pencil font-medium">Phone</p>
                <p className="font-mono font-bold text-ink">{hostel.contact_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-coral" size={22} />
              <div>
                <p className="text-xs text-pencil font-medium">Email</p>
                <p className="font-mono font-bold text-ink">{hostel.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t-2 border-dashed border-ink/20">
            <p className="text-xs text-pencil font-medium">Address</p>
            <p className="font-semibold text-ink mt-1">{hostel.address}</p>
          </div>
        </div>

        {/* Location */}
        <div className="mb-10">
          <span className="stamp-badge inline-block bg-skytape px-3 py-1 text-xs -rotate-1 mb-5">
            Find It On The Map
          </span>
          <HostelMap
            latitude={hostel.latitude}
            longitude={hostel.longitude}
            hostelName={hostel.hostel_name}
          />
        </div>

        {/* Rooms */}
        <div className="mb-10">
          <span className="stamp-badge inline-block bg-marigold px-3 py-1 text-xs -rotate-1 mb-6">
            Available Rooms
          </span>

          {rooms.length === 0 ? (
            <div className="text-center py-12 poster-border rounded-2xl bg-skytape">
              <p className="font-display text-lg text-ink">NO ROOMS LISTED YET</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="poster-border hard-shadow-sm rounded-2xl p-6 bg-paper">
                  <h3 className="font-display text-lg text-ink mb-3">
                    {room.room_type.toUpperCase()}
                  </h3>

                  <div className="space-y-1.5 mb-4 text-sm">
                    <p className="text-pencil"><span className="font-semibold text-ink">Sharing:</span> {room.sharing_type}</p>
                    <p className="text-pencil"><span className="font-semibold text-ink">Total Beds:</span> {room.total_beds}</p>
                    <p className="text-pencil">
                      <span className="font-semibold text-ink">Available:</span>{" "}
                      <span className={room.available_beds > 0 ? "text-green-600 font-bold" : "text-coral font-bold"}>
                        {room.available_beds}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {room.ac && <span className="stamp-badge text-[10px] px-2 py-1 bg-skytape">AC</span>}
                    {room.attached_bathroom && <span className="stamp-badge text-[10px] px-2 py-1 bg-mint">BATH</span>}
                  </div>

                  <div className="pt-4 border-t-2 border-dashed border-ink/15 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-pencil font-medium">Per Month</p>
                      <span className="font-mono font-bold text-xl text-coral">₹{room.price.toLocaleString("en-IN")}</span>
                    </div>
                    <button
                      onClick={() => handleBooking(room.id)}
                      disabled={room.available_beds <= 0}
                      className={`btn-poster px-4 py-2.5 text-sm ${
                        room.available_beds > 0
                          ? "bg-ink text-white hard-shadow-sm"
                          : "bg-pencil-light text-white opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {room.available_beds > 0 ? "Book Now" : "Full"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1">
              Reviews
            </span>
            <div className="flex items-center gap-2">
              <div className="flex text-marigold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className={i < Math.round(hostel.rating || 0) ? "" : "text-pencil-light"} />
                ))}
              </div>
              <span className="font-display text-xl text-ink">{hostel.rating || "N/A"}</span>
            </div>
          </div>

          <div className="poster-border rounded-2xl p-6 mb-8 bg-skytape">
            <h3 className="font-display text-base text-ink mb-4">SHARE YOUR EXPERIENCE</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-pencil block mb-2">Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  className="poster-border rounded-xl p-3 w-full bg-paper font-medium"
                >
                  {[5, 4, 3, 2, 1].map((rate) => (
                    <option key={rate} value={rate}>{"⭐".repeat(rate)} {rate} Stars</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-pencil block mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="poster-border rounded-xl p-3 w-full h-24 resize-none bg-paper font-medium"
                  required
                />
              </div>
              <button type="submit" className="btn-poster bg-ink text-white px-6 py-2.5 hard-shadow-sm text-sm">
                Submit Review
              </button>
            </form>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-pencil text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="poster-border rounded-xl p-5 bg-paper">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-ink">User #{review.user_id}</p>
                      <div className="flex text-marigold mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" className={i < review.rating ? "" : "text-pencil-light"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-pencil font-mono">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-pencil">{review.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostelDetailPanel;
