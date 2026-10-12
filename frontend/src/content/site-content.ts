export const STITCH_IMAGES = {
  heroAttack: "/images/motorcycles/hero-attack.jpg",
  apexProfile: "/images/motorcycles/apex-rs-900.jpg",
  tftCockpit: "/images/motorcycles/tft-cockpit.jpg",
  suspension: "/images/motorcycles/suspension.jpg",
  exhaust: "/images/motorcycles/exhaust.jpg",
} as const;

export const HERO_STATS = [
  { value: "214 HP", label: "Apex Flagship", accent: "text-moto-apex" },
  { value: "0 Emission", label: "Volt EV", accent: "text-moto-volt" },
  { value: "1250cc", label: "Nomad Boxer", accent: "text-moto-nomad" },
  { value: "1800cc", label: "Sovereign Cruiser", accent: "text-moto-sovereign" },
] as const;

export const SERVICES_LIST = [
  {
    title: "Bespoke Commissioning",
    description: "Custom atelier tailoring across carbon aerodynamics, hand-stitched hides, and telemetry suites.",
    tag: "Atelier Bespoke",
  },
  {
    title: "Factory Certified Service",
    description: "Authorized master technicians with direct telemetry link to our Dubai engineering hub.",
    tag: "Factory Care",
  },
  {
    title: "Global Air Freight Logistics",
    description: "Secure, climate-controlled transport from GCC flagships directly to your private circuit.",
    tag: "Global Transit",
  },
] as const;
