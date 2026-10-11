import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFeaturedMotorcycles, getLocations, getBrands, getPromotions } from "@/services/api";
import { Hero } from "@/components/site/Hero";
import { FeaturedMachines } from "@/components/site/FeaturedMachines";
import { ServicesStrip } from "@/components/site/ServicesStrip";
import { PromotionsSection } from "@/components/site/PromotionsSection";
import { LocationsSection } from "@/components/site/LocationsSection";
import { TestRideSection } from "@/components/site/TestRideSection";

export const revalidate = 60;

export default async function ConsumerHomepage() {
  const [motorcyclesResult, locationsResult, brandsResult, promotionsResult] = await Promise.all([
    getFeaturedMotorcycles(),
    getLocations(),
    getBrands(),
    getPromotions(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-moto-bg text-moto-text selection:bg-moto-copper selection:text-white">
      <Navbar />

      <main id="main-content" className="flex-1">
        <Hero />
        <FeaturedMachines brandsResult={brandsResult} motorcyclesResult={motorcyclesResult} />
        <ServicesStrip />
        <PromotionsSection promotionsResult={promotionsResult} />
        <LocationsSection locationsResult={locationsResult} />
        <TestRideSection motorcyclesResult={motorcyclesResult} />
      </main>

      <Footer />
    </div>
  );
}
