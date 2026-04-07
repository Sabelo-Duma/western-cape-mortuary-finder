"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix default marker icons for Leaflet in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const availableIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const limitedIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const fullIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getIcon(availability: string) {
  switch (availability) {
    case "available":
      return availableIcon;
    case "limited":
      return limitedIcon;
    case "full":
      return fullIcon;
    default:
      return defaultIcon;
  }
}

interface MapMortuary {
  name: string;
  slug: string;
  address: string;
  availability: string;
  latitude: number | null;
  longitude: number | null;
}

interface LeafletMapProps {
  mortuaries: MapMortuary[];
  center: [number, number];
  citySlug: string;
}

export function LeafletMap({ mortuaries, center, citySlug }: LeafletMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "350px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mortuaries.map((m) => (
        <Marker
          key={m.slug}
          position={[m.latitude!, m.longitude!]}
          icon={getIcon(m.availability)}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{m.name}</p>
              <p className="text-gray-500 text-xs mt-1">{m.address}</p>
              <p className={`text-xs mt-1 font-medium ${
                m.availability === "available" ? "text-green-600" :
                m.availability === "limited" ? "text-amber-600" : "text-red-600"
              }`}>
                {m.availability === "available" ? "Available" :
                 m.availability === "limited" ? "Limited Space" : "Full"}
              </p>
              <Link
                href={`/mortuaries/${citySlug}/${m.slug}`}
                className="text-xs text-[#1B4965] hover:underline mt-1 inline-block"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
