import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { MapPin, LocateFixed } from "lucide-react";
import { marigoldPin } from "./leafletIcon";

const DEFAULT_CENTER = [17.385044, 78.486671]; // Hyderabad

function ClickHandler({ onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function LocateControl({ onChange }) {
  const map = useMap();

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      onChange(coords);
      map.flyTo([coords.lat, coords.lng], 16);
    });
  };

  return (
    <button
      type="button"
      onClick={handleLocateMe}
      className="stamp-badge absolute top-3 right-3 z-[1000] flex items-center gap-1 px-3 py-1.5 text-[10px] bg-paper hover:bg-marigold transition-colors shadow-md"
    >
      <LocateFixed size={12} /> Use My Location
    </button>
  );
}

function LocationPicker({ value, onChange }) {
  const position = value?.lat && value?.lng ? value : null;

  return (
    <div>
      <label className="text-xs font-bold uppercase text-pencil flex items-center gap-1.5 mb-3">
        <MapPin size={14} /> Pin Your Location
      </label>

      <div className="poster-border rounded-2xl overflow-hidden relative" style={{ height: "280px" }}>
        <MapContainer
          center={position ? [position.lat, position.lng] : DEFAULT_CENTER}
          zoom={position ? 15 : 12}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          <LocateControl onChange={onChange} />
          {position && <Marker position={[position.lat, position.lng]} icon={marigoldPin} />}
        </MapContainer>
      </div>

      <p className="text-xs text-pencil mt-2">
        {position
          ? `Pinned at ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
          : "Click anywhere on the map to drop a pin at your hostel's location."}
      </p>
    </div>
  );
}

export default LocationPicker;
