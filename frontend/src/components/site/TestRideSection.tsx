import type { Motorcycle } from "@/types/api";
import { Result } from "@/lib/result";
import TestRideForm from "@/features/test-ride/TestRideForm";
import { SectionError } from "./SectionError";

interface TestRideSectionProps {
  motorcyclesResult: Result<Motorcycle[]>;
}

export function TestRideSection({ motorcyclesResult }: TestRideSectionProps) {
  const motorcycles = motorcyclesResult.ok ? motorcyclesResult.data : [];

  return (
    <section id="test-ride" aria-labelledby="test-ride-heading" className="py-24 bg-moto-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {!motorcyclesResult.ok && (
          <div className="mb-8">
            <SectionError message="Catalog list unavailable; test ride form may require manual model selection." />
          </div>
        )}
        <TestRideForm motorcycles={motorcycles} />
      </div>
    </section>
  );
}
