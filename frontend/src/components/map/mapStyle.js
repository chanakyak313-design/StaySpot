// Minimal, uncluttered map style to match the poster aesthetic —
// hides most POI clutter and business icons so hostel pins stand out.
export const POSTER_MAP_STYLE = [
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#EAF3FF" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#FFFBF2" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#5C6478" }] },
];

export const MARIGOLD_PIN = {
  path: "M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8z",
  fillColor: "#FFC300",
  fillOpacity: 1,
  strokeColor: "#14213D",
  strokeWeight: 2,
  scale: 1.6,
};
