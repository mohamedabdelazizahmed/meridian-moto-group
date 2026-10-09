"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationItem } from "@/services/api";

interface LocationsMapProps {
  locations: LocationItem[];
}

// Custom DivIcon for showroom vs service
const createCustomIcon = (type: string) => {
  const bgColor = type === 'service' ? '#22D3C5' : '#C8873A';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${bgColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #F4F1EA; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: #0B0B0D; border-radius: 50%;"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
};

export default function LocationsMap({ locations }: LocationsMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter locations with valid lat/lng
  const validLocations = locations.filter(
    (loc) => typeof loc.latitude === "number" && typeof loc.longitude === "number"
  );

  const defaultCenter: [number, number] = validLocations.length > 0
    ? [validLocations[0].latitude!, validLocations[0].longitude!]
    : [25.2048, 55.2708]; // Default to Dubai

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Locations List (5 cols on desktop) */}
      <div className="lg:col-span-5 space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {locations.map((loc, idx) => {
          const id = loc.name || idx.toString();
          const isSelected = selectedId === id;
          const hasCoords = typeof loc.latitude === "number" && typeof loc.longitude === "number";

          return (
            <div
              key={id}
              onClick={() => hasCoords && setSelectedId(id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-moto-surface border-moto-copper ring-2 ring-moto-copper/30 shadow-xl"
                  : "bg-moto-surface/60 border-moto-border hover:border-moto-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-moto-copper">
                  {loc.city} • {loc.type}
                </span>
                <span className={`w-2 h-2 rounded-full ${loc.type === 'service' ? 'bg-moto-volt' : 'bg-moto-copper'}`}></span>
              </div>
              <h4 className="text-lg font-bold text-moto-text uppercase tracking-wider">{loc.name}</h4>
              <p className="text-xs text-moto-muted mt-1">{loc.address}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <a href={`tel:${loc.phone}`} className="text-moto-copper underline hover:text-white">
                  {loc.phone}
                </a>
                <span className="text-moto-muted">{hasCoords ? '📍 Map Active' : '📍 No Coordinates'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Map (7 cols on desktop) */}
      <div className="lg:col-span-7 bg-moto-surface border border-moto-border rounded-xl overflow-hidden shadow-2xl h-[500px] relative z-10">
        <MapContainer
          center={defaultCenter}
          zoom={6}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%", background: "#141418" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validLocations.map((loc, idx) => {
            const id = loc.name || idx.toString();
            const icon = createCustomIcon(loc.type);

            return (
              <Marker
                key={id}
                position={[loc.latitude!, loc.longitude!]}
                icon={icon}
              >
                <Popup>
                  <div className="p-2 text-moto-bg font-sans">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block mb-1">
                      {loc.city} • {loc.type}
                    </span>
                    <h5 className="font-bold text-base text-gray-900 uppercase">{loc.name}</h5>
                    <p className="text-xs text-gray-600 mt-1">{loc.address}</p>
                    <p className="text-xs font-mono text-gray-800 mt-2 font-semibold">{loc.phone}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
