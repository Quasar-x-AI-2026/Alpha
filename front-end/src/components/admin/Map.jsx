import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import customMarkerIcon from "../../images/location marker.png";

export default function Map({ latitude, longitude }) {
  const map = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Normalize backend values
  const lat = Number(latitude);
  const lng = Number(longitude);

  useEffect(() => {
    if (!mapRef.current) return;

    // If coords are invalid, fallback (you can set your city default)
    const safeLat = Number.isFinite(lat) ? lat : 0;
    const safeLng = Number.isFinite(lng) ? lng : 0;

    // Create map only once
    if (!map.current) {
      map.current = L.map(mapRef.current).setView([safeLat, safeLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map.current);

      const customIcon = L.icon({
        iconUrl: customMarkerIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      markerRef.current = L.marker([safeLat, safeLng], { icon: customIcon }).addTo(
        map.current
      );
    } else {
      // Update view + marker when backend coords change
      map.current.setView([safeLat, safeLng], 15);
      if (markerRef.current) markerRef.current.setLatLng([safeLat, safeLng]);
    }

    return () => {
      // Clean up when component unmounts (dialog closes permanently)
      if (map.current) {
        map.current.remove();
        map.current = null;
        markerRef.current = null;
      }
    };
  }, [lat, lng]);

  return <div className="w-full h-full" ref={mapRef} />;
}
