"use client";

import dynamic from "next/dynamic";
import { LocationItem } from "@/services/api";

const LocationsMap = dynamic(() => import("./LocationsMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-moto-surface border border-moto-border rounded-xl h-[500px] flex items-center justify-center animate-pulse">
      <div className="text-moto-muted font-mono text-sm tracking-wider uppercase">
        [LOADING GCC REGIONAL MAP...]
      </div>
    </div>
  ),
});

interface DynamicLocationsMapProps {
  locations: LocationItem[];
}

export default function DynamicLocationsMap({ locations }: DynamicLocationsMapProps) {
  return <LocationsMap locations={locations} />;
}
