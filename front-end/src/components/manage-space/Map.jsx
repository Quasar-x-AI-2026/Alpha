import React from "react";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Button from "../form/Button";
import customMarkerIcon from "../../images/location marker.png";

export default function Map(props) {
  const map = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const initialLat = Number(props.latitude);
  const initialLng = Number(props.longitude);

  const [center, setCenter] = useState([
    Number.isFinite(initialLat) && initialLat !== 0 ? initialLat : 40.7128,
    Number.isFinite(initialLng) && initialLng !== 0 ? initialLng : -74.006,
  ]);

  const [input, setInput] = useState("");

  // Create map once
  useEffect(() => {
    if (!mapRef.current || map.current) return;

    map.current = L.map(mapRef.current).setView(center, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map.current);

    const customIcon = L.icon({
      iconUrl: customMarkerIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Create marker (default at center)
    markerRef.current = L.marker(center, { icon: customIcon }).addTo(map.current);

    // Click handler (only if not readOnly)
    const handleClick = (event) => {
      if (props.readOnly) return;

      const clickedLatitude = Number(event.latlng.lat);
      const clickedLongitude = Number(event.latlng.lng);

      markerRef.current?.setLatLng([clickedLatitude, clickedLongitude]);

      props.setLatitude(clickedLatitude);
      props.setLongitude(clickedLongitude);
    };

    if (!props.readOnly) {
      map.current.on("click", handleClick);
    }

    return () => {
      if (map.current) {
        if (!props.readOnly) map.current.off("click", handleClick);
        map.current.remove();
        map.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  // When center changes, update view + marker
  useEffect(() => {
    if (!map.current) return;
    map.current.setView(center, 13);
    markerRef.current?.setLatLng(center);
  }, [center]);

  // If backend values (props.latitude/longitude) arrive later, reflect them
  useEffect(() => {
    const lat = Number(props.latitude);
    const lng = Number(props.longitude);

    if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
      setCenter([lat, lng]);

      // keep your previous behavior: set in parent too
      props.setLatitude(lat);
      props.setLongitude(lng);
    }
    // eslint-disable-next-line
  }, [props.latitude, props.longitude]);

  const getUserLocation = () => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const userLatitude = Number(position.coords.latitude);
      const userLongitude = Number(position.coords.longitude);
      setCenter([userLatitude, userLongitude]);
    });
  };

  const handleUserEnteredLocation = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          input
        )}&format=json`
      );

      if (!response.ok) {
        console.error("Error fetching location data");
        return;
      }

      const locationData = await response.json();
      if (!locationData?.length) {
        console.error("Location not found");
        return;
      }

      const userLocation = locationData[0];
      const userLatitude = Number(userLocation.lat);
      const userLongitude = Number(userLocation.lon);

      setCenter([userLatitude, userLongitude]);
    } catch (error) {
      console.error("Error handling user-entered location:", error);
    }
  };

  return (
    <div className="relative z-10 w-[96%] h-[96%] flex flex-col items-center justify-center gap-5 p-5 bg-white rounded-lg">
      <div className="flex flex-col w-full gap-2 lg:gap-3 lg:flex-row">
        <input
          type="text"
          placeholder="Search"
          className="w-full input input-bordered"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button
          className="lg:w-[150px] py-[10px] text-white rounded-lg bg-c3 font-bold"
          onClick={handleUserEnteredLocation}
        >
          Search
        </Button>

        <Button
          className="lg:w-[300px] py-[10px] text-white rounded-lg bg-c3 font-bold"
          onClick={getUserLocation}
        >
          Use Current Location
        </Button>
      </div>

      <div className="w-full h-[90%] border rounded" ref={mapRef}></div>

      <div onClick={() => props.scrollTo("image")} className="block w-full">
        <Button className="w-full py-[10px] text-white rounded-lg bg-c3 font-bold">
          Next
        </Button>
      </div>
    </div>
  );
}
