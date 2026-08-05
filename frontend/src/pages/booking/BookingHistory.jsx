import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Calendar, DoorOpen, X, Download } from "lucide-react";
import { getMyBookings, cancelBooking, downloadReceipt } from "../../services/bookingService";

const STATUS_STYLES = {
  Pending: "bg-marigold text-ink",
  Confirmed: "bg-mint text-ink",
  Cancelled: "bg-pencil-light text-white",
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
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      loadBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Couldn't cancel booking");
    }
  };

  const handleReceipt = async (id) => {
    try {
      await downloadReceipt(id);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't download receipt");
    }
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-5xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-coral text-white px-3 py-1 text-xs rotate-1">
            Your Ticket Stubs
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            MY BOOKINGS
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="font-display text-xl text-pencil text-center py-16">LOADING...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 poster-border rounded-2xl bg-skytape">
            <p className="font-display text-xl text-ink">NO BOOKINGS YET</p>
            <p className="text-pencil mt-2 mb-6">Your booked hostels will show up here.</p>
            <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm">
              Explore Hostels
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-paper poster-border hard-shadow-sm rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-skytape border-2 border-ink flex items-center justify-center shrink-0">
                    <DoorOpen size={20} className="text-ink" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-pencil">BOOKING #{String(booking.id).padStart(4, "0")}</p>
                    <p className="font-display text-lg text-ink">Room #{booking.room_id}</p>
                    <p className="flex items-center gap-1.5 text-sm text-pencil mt-1">
                      <Calendar size={14} />
                      {new Date(booking.booking_date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`stamp-badge px-3 py-1.5 text-xs ${STATUS_STYLES[booking.status] || "bg-skytape text-ink"}`}>
                    {booking.status}
                  </span>

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleReceipt(booking.id)}
                      className="btn-poster bg-paper text-ink px-3 py-2 hard-shadow-sm flex items-center gap-1 text-sm"
                    >
                      <Download size={14} />
                      Receipt
                    </button>
                  )}

                  {booking.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="btn-poster bg-paper text-coral px-3 py-2 hard-shadow-sm flex items-center gap-1 text-sm"
                    >
                      <X size={14} />
                      Cancel
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
