import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Star } from "lucide-react";
import { marigoldPin } from "./leafletIcon";

function HostelsMapView({ hostels }) {
  const navigate = useNavigate();
  const located = hostels.filter((h) => h.latitude && h.longitude);

  if (located.length === 0) {
    return (
      <div className="poster-border rounded-2xl p-10 bg-skytape text-center">
        <MapPin className="mx-auto text-pencil mb-2" size={28} />
        <p className="font-display text-lg text-ink">NO PINNED LOCATIONS YET</p>
        <p className="text-pencil mt-2">None of these hostels have a location pinned by their owner.</p>
      </div>
    );
  }

  const center = [located[0].latitude, located[0].longitude];

  return (
    <div className="poster-border rounded-2xl overflow-hidden" style={{ height: "560px" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map((hostel) => (
          <Marker
            key={hostel.id}
            position={[hostel.latitude, hostel.longitude]}
            icon={marigoldPin}
          >
            <Popup>
              <div className="p-1 max-w-[200px]">
                <p className="font-bold text-ink text-sm mb-1">{hostel.hostel_name}</p>
                <p className="text-xs text-gray-600 mb-2">{hostel.area}, {hostel.city}</p>
                <div className="flex items-center gap-1 text-xs text-amber-600 mb-2">
                  <Star size={11} fill="currentColor" /> {hostel.rating || "New"}
                </div>
                <button
                  onClick={() => navigate(`/hostel/${hostel.id}`)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default HostelsMapView;
