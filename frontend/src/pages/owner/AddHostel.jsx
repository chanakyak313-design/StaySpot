import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import api from "../../services/api";
import ImageUpload from "../../components/ImageUpload";
import LocationPicker from "../../components/map/LocationPicker";

const BLANK_FORM = {
  hostel_name: "",
  description: "",
  city: "",
  area: "",
  address: "",
  contact_number: "",
  email: "",
  latitude: null,
  longitude: null,
  food: false,
  wifi: false,
  parking: false,
  laundry: false,
  cctv: false,
  power_backup: false,
};

const AMENITIES = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "food", label: "Homely Food" },
  { key: "parking", label: "Parking" },
  { key: "laundry", label: "Laundry" },
  { key: "cctv", label: "CCTV" },
  { key: "power_backup", label: "Power Backup" },
];

function AddHostel() {
  const [hostelId, setHostelId] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-skytape px-4">
        <div className="text-center poster-border hard-shadow rounded-2xl bg-paper p-10 max-w-md">
          <Building2 size={36} className="mx-auto text-ink mb-3" />
          <h2 className="font-display text-2xl text-ink">PLEASE LOG IN</h2>
          <p className="text-pencil mt-2 mb-6 text-sm">
            You must be logged in as a hostel owner to publish a listing.
          </p>
          <Link to="/login" className="btn-poster inline-block bg-marigold text-ink px-6 py-3 hard-shadow-sm font-bold text-sm">
            Sign In As Owner
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.post("/hostels/", form);
      toast.success("Hostel added! Now add some photos below.");
      setHostelId(response.data.id);
      setForm(BLANK_FORM);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error adding hostel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-20">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-2xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2 font-bold">
            New Listing
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            ADD YOUR HOSTEL
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="poster-border hard-shadow rounded-2xl p-8 bg-paper space-y-5">
          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Hostel Name</label>
            <input
              type="text"
              name="hostel_name"
              value={form.hostel_name}
              onChange={handleChange}
              placeholder="e.g. Sri Lakshmi Luxury PG"
              required
              className="w-full poster-border rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your hostel, rules, food timings, warden contact..."
              className="w-full poster-border rounded-xl p-3 h-28 resize-none font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Hyderabad"
                required
                className="w-full poster-border rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Area / Locality</label>
              <input
                type="text"
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Gachibowli"
                required
                className="w-full poster-border rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Full Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Plot No. 42, Near Tech Park"
              required
              className="w-full poster-border rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Phone</label>
              <input
                type="tel"
                name="contact_number"
                value={form.contact_number}
                onChange={handleChange}
                placeholder="9876543210"
                required
                className="w-full poster-border rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Contact Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="owner@example.com"
                required
                className="w-full poster-border rounded-xl p-3 font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Pin on Map (Optional)</label>
            <LocationPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={({ lat, lng }) =>
                setForm({ ...form, latitude: lat, longitude: lng })
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-3">Amenities</label>
            <div className="grid grid-cols-2 gap-3">
              {AMENITIES.map((a) => (
                <label
                  key={a.key}
                  className={`flex items-center gap-2 poster-border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                    form[a.key] ? "bg-marigold" : "bg-paper"
                  }`}
                >
                  <input
                    type="checkbox"
                    name={a.key}
                    checked={form[a.key]}
                    onChange={handleChange}
                    className="accent-ink w-4 h-4"
                  />
                  <span className="font-semibold text-sm text-ink">{a.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-poster w-full bg-marigold text-ink py-3.5 hard-shadow-sm font-bold text-sm disabled:opacity-60"
          >
            {saving ? "Publishing..." : "Add Hostel Listing"}
          </button>
        </form>

        {hostelId && (
          <div className="mt-8 space-y-4">
            <ImageUpload hostelId={hostelId} />
            <div className="text-center pt-4">
              <Link to={`/owner/hostels/${hostelId}/add-room`} className="btn-poster inline-block bg-ink text-white px-8 py-3.5 hard-shadow-sm font-bold text-sm">
                Now Add a Room to This Hostel →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddHostel;
