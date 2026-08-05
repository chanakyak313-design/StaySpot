import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
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
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-2xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-marigold text-ink px-3 py-1 text-xs -rotate-2">
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
              name="hostel_name"
              placeholder="e.g. Sunrise PG"
              value={form.hostel_name}
              onChange={handleChange}
              required
              className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Description</label>
            <textarea
              name="description"
              placeholder="What makes your hostel a good fit for students?"
              value={form.description}
              onChange={handleChange}
              className="poster-border rounded-xl p-3 w-full h-24 resize-none font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">City</label>
              <input
                name="city"
                placeholder="Hyderabad"
                value={form.city}
                onChange={handleChange}
                required
                className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Area</label>
              <input
                name="area"
                placeholder="Gachibowli"
                value={form.area}
                onChange={handleChange}
                required
                className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Full Address</label>
            <input
              name="address"
              placeholder="Street, landmark, pin code"
              value={form.address}
              onChange={handleChange}
              required
              className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Phone</label>
              <input
                name="contact_number"
                placeholder="9876543210"
                value={form.contact_number}
                onChange={handleChange}
                required
                className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Email</label>
              <input
                name="email"
                type="email"
                placeholder="hostel@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="poster-border rounded-xl p-3 w-full font-medium focus:outline-none focus:ring-2 focus:ring-marigold"
              />
            </div>
          </div>

          <div>
            <LocationPicker
              value={
                form.latitude && form.longitude
                  ? { lat: form.latitude, lng: form.longitude }
                  : null
              }
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
            className="btn-poster w-full bg-marigold text-ink py-3.5 hard-shadow-sm disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add Hostel"}
          </button>
        </form>

        {hostelId && (
          <>
            <ImageUpload hostelId={hostelId} />
            <div className="mt-6 text-center">
              <Link to={`/owner/hostels/${hostelId}/add-room`} className="btn-poster inline-block bg-ink text-white px-6 py-3 hard-shadow-sm">
                Now Add a Room →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddHostel;
