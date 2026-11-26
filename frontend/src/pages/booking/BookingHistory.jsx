import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Calendar, DoorOpen, X, Download, MapPin, ExternalLink, IndianRupee } from "lucide-react";
import { getMyBookings, cancelBooking, downloadReceipt } from "../../services/bookingService";

const STATUS_STYLES = {
  Pending: "bg-marigold text-ink",
  Confirmed: "bg-mint text-ink font-bold",
  Cancelled: "bg-coral text-white",
};

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("Please login to view your bookings.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't cancel booking");
    }
  };

  const handleReceipt = async (id) => {
    try {
      toast.loading("Preparing receipt...", { id: "receipt" });
      await downloadReceipt(id);
      toast.success("Receipt downloaded!", { id: "receipt" });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't download receipt", { id: "receipt" });
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-20">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1">
              Your Ticket Stubs
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
              MY BOOKINGS
            </h1>
          </div>
          <Link to="/hostels" className="btn-poster bg-marigold text-ink px-5 py-2.5 hard-shadow-sm text-sm">
            Find Another Hostel
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="font-display text-xl text-pencil animate-pulse">LOADING BOOKINGS...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 poster-border rounded-2xl bg-skytape">
            <div className="w-14 h-14 rounded-full bg-marigold border-2 border-ink flex items-center justify-center mx-auto mb-4">
              <DoorOpen size={24} className="text-ink" />
            </div>
            <p className="font-display text-xl text-ink">NO BOOKINGS YET</p>
            <p className="text-pencil mt-2 mb-6 max-w-sm mx-auto">
              You haven't reserved any hostel rooms yet. Browse verified listings and book in seconds.
            </p>
            <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
              Explore Hostels
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-paper poster-border hard-shadow-sm rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden poster-border shrink-0 bg-skytape relative">
                    <img
                      src={booking.image_url || "https://picsum.photos/seed/hostel/300/300"}
                      alt={booking.hostel_name || "Hostel"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-pencil">
                        REF #STAY-{String(booking.id).padStart(4, "0")}
                      </span>
                      <span className={`stamp-badge px-2.5 py-0.5 text-[10px] ${STATUS_STYLES[booking.status] || "bg-skytape text-ink"}`}>
                        {booking.status}
                      </span>
                    </div>

                    <h2 className="font-display text-xl text-ink mt-1">
                      {booking.hostel_name || `Hostel Room #${booking.room_id}`}
                    </h2>

                    {(booking.area || booking.city) && (
                      <p className="flex items-center gap-1 text-xs text-pencil mt-1">
                        <MapPin size={12} className="text-coral" />
                        {booking.area ? `${booking.area}, ` : ""}{booking.city}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-pencil mt-2">
                      <span className="font-semibold text-ink">
                        {booking.room_type || "Room"} {booking.sharing_type ? `(${booking.sharing_type} Sharing)` : ""}
                      </span>
                      {booking.price ? (
                        <span className="font-mono font-bold text-coral">
                          ₹{booking.price.toLocaleString("en-IN")}/month
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1 text-pencil">
                        <Calendar size={12} />
                        {booking.booking_date
                          ? new Date(booking.booking_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  {booking.hostel_id && (
                    <Link
                      to={`/hostel/${booking.hostel_id}`}
                      className="btn-poster bg-skytape text-ink px-3.5 py-2 hard-shadow-sm flex items-center gap-1.5 text-xs font-bold"
                    >
                      <ExternalLink size={13} /> Details
                    </Link>
                  )}

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleReceipt(booking.id)}
                      className="btn-poster bg-paper text-ink px-3.5 py-2 hard-shadow-sm flex items-center gap-1.5 text-xs font-bold hover:bg-mint transition-colors"
                    >
                      <Download size={13} /> PDF Receipt
                    </button>
                  )}

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="btn-poster bg-paper text-coral px-3.5 py-2 hard-shadow-sm flex items-center gap-1.5 text-xs font-bold hover:bg-coral hover:text-white transition-colors"
                    >
                      <X size={13} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
