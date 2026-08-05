import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import { marigoldPin } from "./leafletIcon";

function HostelMap({ latitude, longitude, hostelName }) {
  if (!latitude || !longitude) {
    return (
      <div className="poster-border rounded-2xl p-8 bg-skytape text-center">
        <MapPin className="mx-auto text-pencil mb-2" size={24} />
        <p className="text-sm text-pencil font-medium">
          The owner hasn't pinned this hostel's exact location yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="poster-border rounded-2xl overflow-hidden" style={{ height: "320px" }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={marigoldPin}>
            <Popup>{hostelName}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-poster mt-3 inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 text-sm hard-shadow-sm"
      >
        <Navigation size={14} /> Get Directions
      </a>
    </div>
  );
}

export default HostelMap;
