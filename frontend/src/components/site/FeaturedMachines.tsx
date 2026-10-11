"use client";

import { useState } from "react";
import type { Brand, Motorcycle } from "@/types/api";
import { Result } from "@/lib/result";
import { SectionError } from "./SectionError";
import { EmptyState } from "./EmptyState";
import { MotorcycleCard } from "./MotorcycleCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FeaturedMachinesProps {
  brandsResult: Result<Brand[]>;
  motorcyclesResult: Result<Motorcycle[]>;
}

export function FeaturedMachines({ brandsResult, motorcyclesResult }: FeaturedMachinesProps) {
  const [selectedMarque, setSelectedMarque] = useState<string>("all");

  const brands = brandsResult.ok ? brandsResult.data : [];
  const motorcycles = motorcyclesResult.ok ? motorcyclesResult.data : [];

  const filteredMotorcycles = selectedMarque === "all"
    ? motorcycles
    : motorcycles.filter((m) => m.brand?.slug === selectedMarque);

  return (
    <section id="marques" aria-labelledby="marques-heading" className="py-20 bg-moto-bg border-b border-moto-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2 block">Operational Marque Portfolio</span>
              <h2 id="marques-heading" className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
                THE FOUR DISTINCT MARQUES
              </h2>
            </div>

            {brandsResult.ok && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0" aria-label="Marque filters">
                <button
                  type="button"
                  onClick={() => setSelectedMarque("all")}
                  className={`px-4 py-2 rounded text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${
                    selectedMarque === "all"
                      ? "bg-moto-copper text-moto-bg"
                      : "bg-moto-surface border border-moto-border text-moto-muted hover:text-moto-text"
                  }`}
                >
                  All Marques
                </button>
                {brands.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => setSelectedMarque(b.slug)}
                    className={`px-4 py-2 rounded text-xs font-barlow font-bold uppercase tracking-wider transition-colors ${
                      selectedMarque === b.slug
                        ? "bg-moto-copper text-moto-bg"
                        : "bg-moto-surface border border-moto-border text-moto-muted hover:text-moto-text"
                    }`}
                  >
                    {b.name} {b.segment ? `(${b.segment})` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>

        {!motorcyclesResult.ok ? (
          <SectionError message="Unable to load motorcycle catalog from API at this moment. Please verify backend service connectivity." />
        ) : filteredMotorcycles.length === 0 ? (
          <EmptyState message="No motorcycle models currently available for this selection." />
        ) : (
          <RevealOnScroll delay={200}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-14 pt-2"
            >
              {filteredMotorcycles.map((moto) => (
                <SwiperSlide key={moto.slug} className="h-auto">
                  <MotorcycleCard moto={moto} />
                </SwiperSlide>
              ))}
            </Swiper>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
