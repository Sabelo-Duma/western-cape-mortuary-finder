"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface MapMortuary {
  name: string;
  slug: string;
  address: string;
  availability: string;
  latitude: number | null;
  longitude: number | null;
}

interface MortuaryMapProps {
  mortuaries: MapMortuary[];
  citySlug: string;
  cityName: string;
}

// Default center coordinates for Western Cape cities
const CITY_CENTERS: Record<string, [number, number]> = {
  "cape-town": [-33.9249, 18.4241],
  "stellenbosch": [-33.9346, 18.8602],
  "paarl": [-33.7273, 18.9706],
  "worcester": [-33.6463, 19.4438],
  "george": [-33.9630, 22.4620],
  "knysna": [-34.0356, 23.0488],
  "mossel-bay": [-34.1830, 22.1460],
  "hermanus": [-34.4180, 19.2420],
  "malmesbury": [-33.4612, 18.7280],
  "beaufort-west": [-32.3534, 22.5831],
};

export function MortuaryMap({ mortuaries, citySlug, cityName }: MortuaryMapProps) {
  const [showMap, setShowMap] = useState(false);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{
    mortuaries: MapMortuary[];
    center: [number, number];
    citySlug: string;
  }> | null>(null);

  useEffect(() => {
    if (showMap) {
      // Dynamic import to avoid SSR issues with Leaflet
      import("./leaflet-map").then((mod) => {
        setMapComponent(() => mod.LeafletMap);
      });
    }
  }, [showMap]);

  const mortuariesWithCoords = mortuaries.filter(
    (m) => m.latitude && m.longitude
  );

  if (mortuariesWithCoords.length === 0) return null;

  const center = CITY_CENTERS[citySlug] || [-33.9249, 18.4241];

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowMap(!showMap)}
        className="flex items-center gap-2 text-sm font-medium text-[#1B4965] hover:text-[#143A50] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B4965] rounded px-1"
      >
        <MapPin className="h-4 w-4" />
        {showMap ? "Hide Map" : `Show Map (${mortuariesWithCoords.length} locations)`}
      </button>

      {showMap && MapComponent && (
        <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <MapComponent
            mortuaries={mortuariesWithCoords}
            center={center}
            citySlug={citySlug}
          />
        </div>
      )}
    </div>
  );
}
