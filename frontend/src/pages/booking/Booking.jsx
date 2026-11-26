import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  DoorOpen,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Download,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  Star,
  Clock
} from "lucide-react";
import { getRoomById } from "../../services/roomService";
import { getHostelById } from "../../services/hostelService";
import { createBooking, downloadReceipt } from "../../services/bookingService";

export default function Booking() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  const [checkInDate, setCheckInDate] = useState(defaultDate);
  const [duration, setDuration] = useState("3 Months");
  const [specialRequest, setSpecialRequest] = useState("");

  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("fullName") || "Guest";

  useEffect(() => {
    if (!roomId) return;
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const roomData = await getRoomById(roomId);
      setRoom(roomData);

      if (roomData.hostel_id) {
        const hostelData = await getHostelById(roomData.hostel_id);
        setHostel(hostelData);
      }
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load room details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!token) {
      toast.error("Please login to complete your booking.");
      navigate("/login");
      return;
    }

    if (room.available_beds <= 0) {
      toast.error("Sorry, this room is already fully booked.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking({ room_id: parseInt(roomId) });
      setBookingConfirmed(res);
      toast.success("Booking confirmed successfully! 🎉");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (bookingId) => {
    try {
      await downloadReceipt(bookingId);
      toast.success("Receipt downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't download receipt.");
    }
  };

  if (loading) {
    return (
      <div className="bg-paper min-h-[70vh] flex items-center justify-center">
        <p className="font-display text-xl text-pencil animate-pulse">PREPARING BOOKING...</p>
      </div>
    );
  }

  if (!room || !hostel) {
    return (
      <div className="bg-paper min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center poster-border rounded-2xl bg-skytape p-10 max-w-md">
          <DoorOpen size={32} className="mx-auto text-ink mb-3" />
          <h2 className="font-display text-xl text-ink">ROOM NOT FOUND</h2>
          <p className="text-pencil mt-2 mb-6">This room listing might no longer be available.</p>
          <Link to="/hostels" className="btn-poster inline-block bg-marigold text-ink px-6 py-2.5">
            Explore Other Hostels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* Header */}
      <div className="bg-ink border-b-[3px] border-ink py-10">
        <div className="max-w-5xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white/70 hover:text-white flex items-center gap-1.5 text-xs font-bold uppercase mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Hostel Details
          </button>
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-1 font-bold">
            Secure Reservation
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-3">
            CONFIRM YOUR STAY
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        {bookingConfirmed ? (
          /* Confirmation Success Card */
          <div className="poster-border hard-shadow rounded-2xl bg-mint p-8 md:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-paper border-2 border-ink flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-ink" />
            </div>
            <span className="stamp-badge inline-block bg-ink text-white px-3 py-1 text-xs mb-3">
              Booking Confirmed
            </span>
            <h2 className="font-display text-3xl text-ink">
              YOU'RE ALL SET, {fullName.split(" ")[0].toUpperCase()}!
            </h2>
            <p className="text-ink/80 mt-2 font-medium">
              Your room at <span className="font-bold">{hostel.hostel_name}</span> is officially locked in.
            </p>

            <div className="bg-paper poster-border rounded-xl p-5 my-6 text-left space-y-2">
              <div className="flex justify-between border-b pb-2 text-sm">
                <span className="text-pencil">Booking Ref ID</span>
                <span className="font-mono font-bold text-ink">#STAY-{String(bookingConfirmed.id).padStart(4, "0")}</span>
              </div>
              <div className="flex justify-between border-b py-2 text-sm">
                <span className="text-pencil">Room Type</span>
                <span className="font-bold text-ink">{room.room_type} ({room.sharing_type} Sharing)</span>
              </div>
              <div className="flex justify-between border-b py-2 text-sm">
                <span className="text-pencil">Check-in Date</span>
                <span className="font-bold text-ink">{checkInDate}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm">
                <span className="text-pencil">Monthly Rent</span>
                <span className="font-mono font-bold text-coral text-base">₹{room.price.toLocaleString("en-IN")}/mo</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleDownload(bookingConfirmed.id)}
                className="btn-poster bg-marigold text-ink px-6 py-3 hard-shadow-sm flex items-center gap-2 text-sm"
              >
                <Download size={16} /> Download Official PDF Receipt
              </button>
              <Link
                to="/my-bookings"
                className="btn-poster bg-paper text-ink px-6 py-3 hard-shadow-sm text-sm"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        ) : (
          /* Two-column Checkout Layout */
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form & Preferences */}
            <div className="md:col-span-7 space-y-6">
              {/* Check-in Details */}
              <div className="bg-paper poster-border hard-shadow-sm rounded-2xl p-6">
                <h2 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-coral" /> Stay Preferences
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-pencil block mb-2">
                      Preferred Check-in Date
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      min={defaultDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full poster-border rounded-xl p-3 font-medium bg-paper focus:outline-none focus:ring-2 focus:ring-marigold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-pencil block mb-2">
                      Planned Duration
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["1 Month", "3 Months", "6 Months", "1 Academic Year"].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDuration(dur)}
                          className={`poster-border rounded-xl p-2.5 text-xs font-bold transition-all ${
                            duration === dur ? "bg-marigold text-ink hard-shadow-sm" : "bg-paper text-pencil hover:bg-skytape"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-pencil block mb-2">
                      Special Requests / Notes (Optional)
                    </label>
                    <textarea
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder="e.g. Upper bunk preference, quiet study area..."
                      className="w-full poster-border rounded-xl p-3 text-sm font-medium bg-paper h-20 resize-none focus:outline-none focus:ring-2 focus:ring-marigold"
                    />
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Banner */}
              <div className="bg-skytape poster-border rounded-2xl p-5 flex items-start gap-3.5">
                <ShieldCheck size={28} className="text-ink shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-sm text-ink">STAYSPOT ZERO RISK PROMISE</h3>
                  <p className="text-xs text-ink/80 mt-1 leading-relaxed">
                    Verified property with direct owner pricing. Instant confirmation, automated PDF invoice, and free cancellation assistance before move-in.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="md:col-span-5">
              <div className="bg-paper poster-border hard-shadow rounded-2xl p-6 sticky top-24">
                <span className="stamp-badge inline-block bg-mint text-ink px-2.5 py-1 text-xs mb-3">
                  Summary
                </span>
                <h2 className="font-display text-xl text-ink">
                  {hostel.hostel_name}
                </h2>
                <p className="text-xs text-pencil flex items-center gap-1 mt-1">
                  <MapPin size={13} /> {hostel.area}, {hostel.city}
                </p>

                {/* Thumbnail */}
                <div className="mt-4 rounded-xl overflow-hidden poster-border h-36 relative">
                  <img
                    src={
                      hostel.images?.length > 0
                        ? hostel.images[0].image_url
                        : "https://picsum.photos/seed/hostel/600/400"
                    }
                    alt={hostel.hostel_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 stamp-badge bg-marigold text-ink text-[10px] px-2 py-0.5 flex items-center gap-1">
                    <Star size={11} fill="currentColor" /> {hostel.rating || "4.8"}
                  </div>
                </div>

                {/* Room Specs */}
                <div className="mt-4 p-3.5 bg-skytape/40 poster-border rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-pencil">Room Type</span>
                    <span className="font-bold text-ink">{room.room_type}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-pencil">Sharing Type</span>
                    <span className="font-bold text-ink">{room.sharing_type} Sharing</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-pencil">AC & Bath</span>
                    <span className="font-bold text-ink">
                      {room.ac ? "AC" : "Non-AC"} • {room.attached_bathroom ? "Attached Bath" : "Common"}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-pencil">Available Beds</span>
                    <span className="font-bold text-green-700">{room.available_beds} beds free</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mt-5 pt-4 border-t-2 border-dashed border-ink/15 space-y-2 text-sm">
                  <div className="flex justify-between text-pencil">
                    <span>Monthly Rent</span>
                    <span className="font-mono font-bold text-ink">₹{room.price.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-pencil">
                    <span>Security Deposit</span>
                    <span className="text-green-600 font-bold">Waived (₹0)</span>
                  </div>
                  <div className="flex justify-between text-pencil">
                    <span>Platform Booking Fee</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-ink font-display text-lg pt-2 border-t border-ink/10">
                    <span>Total Due Monthly</span>
                    <span className="text-coral font-mono">₹{room.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-6">
                  {token ? (
                    <button
                      onClick={handleConfirmBooking}
                      disabled={submitting || room.available_beds <= 0}
                      className="btn-poster w-full bg-marigold text-ink py-4 hard-shadow-sm font-display text-base disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      {submitting ? "Confirming..." : "Confirm & Book Room"}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="btn-poster block w-full text-center bg-marigold text-ink py-3.5 hard-shadow-sm font-bold text-sm"
                      >
                        Login to Complete Booking
                      </Link>
                      <p className="text-[11px] text-center text-pencil">
                        Quick 1-click student demo login available on the login page!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
