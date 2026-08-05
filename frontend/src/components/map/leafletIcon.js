import L from "leaflet";

// Custom marigold pin matching the poster theme, built as an inline SVG
// divIcon. This sidesteps Leaflet's well-known bundler issue where its
// default marker image paths break under Vite/webpack.
export const marigoldPin = L.divIcon({
  className: "stayspot-marker",
  html: `
    <svg width="30" height="42" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22c0-6.6-5.4-12-12-12z"
            fill="#FFC300" stroke="#14213D" stroke-width="2"/>
      <circle cx="12" cy="12" r="4.5" fill="#14213D"/>
    </svg>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -38],
});
