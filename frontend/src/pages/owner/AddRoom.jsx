import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createRoom } from "../../services/roomService";

function AddRoom() {
  const { id: hostelId } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    hostel_id: parseInt(hostelId),
    room_type: "",
    sharing_type: "",
    total_beds: 1,
    available_beds: 1,
    price: 0,
    ac: false,
    attached_bathroom: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createRoom(form);
      toast.success("Room added successfully!");
      navigate(`/hostel/${hostelId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error adding room");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-ink border-b-[3px] border-ink py-12">
        <div className="max-w-xl mx-auto px-6">
          <span className="stamp-badge inline-block bg-mint text-ink px-3 py-1 text-xs rotate-1">
            New Room
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-white mt-4">
            ADD A ROOM
          </h1>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="poster-border hard-shadow rounded-2xl p-8 bg-paper space-y-5">
          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Room Type</label>
            <select
              name="room_type"
              value={form.room_type}
              onChange={handleChange}
              required
              className="poster-border rounded-xl p-3 w-full font-medium"
            >
              <option value="">Select Room Type</option>
              <option value="Dormitory">Dormitory</option>
              <option value="Private">Private</option>
              <option value="Semi-Private">Semi-Private</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Sharing Type</label>
            <select
              name="sharing_type"
              value={form.sharing_type}
              onChange={handleChange}
              required
              className="poster-border rounded-xl p-3 w-full font-medium"
            >
              <option value="">Select Sharing Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Four">Four Sharing</option>
              <option value="Six">Six Sharing</option>
              <option value="Eight">Eight Sharing</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Total Beds</label>
              <input
                type="number"
                name="total_beds"
                min="1"
                value={form.total_beds}
                onChange={handleChange}
                required
                className="poster-border rounded-xl p-3 w-full font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-pencil block mb-2">Available Beds</label>
              <input
                type="number"
                name="available_beds"
                min="0"
                value={form.available_beds}
                onChange={handleChange}
                required
                className="poster-border rounded-xl p-3 w-full font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-pencil block mb-2">Price (per month)</label>
            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="poster-border rounded-xl p-3 w-full font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center gap-2 poster-border rounded-xl px-4 py-3 cursor-pointer ${form.ac ? "bg-marigold" : "bg-paper"}`}>
              <input type="checkbox" name="ac" checked={form.ac} onChange={handleChange} className="accent-ink w-4 h-4" />
              <span className="font-semibold text-sm text-ink">AC Available</span>
            </label>
            <label className={`flex items-center gap-2 poster-border rounded-xl px-4 py-3 cursor-pointer ${form.attached_bathroom ? "bg-marigold" : "bg-paper"}`}>
              <input type="checkbox" name="attached_bathroom" checked={form.attached_bathroom} onChange={handleChange} className="accent-ink w-4 h-4" />
              <span className="font-semibold text-sm text-ink">Attached Bathroom</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-poster w-full bg-marigold text-ink py-3.5 hard-shadow-sm disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;
