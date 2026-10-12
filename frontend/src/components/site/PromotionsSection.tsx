import type { Schemas } from "@/types/api";
import { Result } from "@/lib/result";
import { SectionError } from "./SectionError";
import { formatDate } from "@/lib/date";
import Image from "next/image";

interface PromotionsSectionProps {
  promotionsResult: Result<Schemas["SitePromotion"][]>;
}

export function PromotionsSection({ promotionsResult }: PromotionsSectionProps) {
  if (!promotionsResult.ok) {
    return (
      <section aria-labelledby="promotions-heading" className="py-16 bg-moto-bg border-b border-moto-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionError message="Unable to load active promotions." />
        </div>
      </section>
    );
  }

  const promotions = promotionsResult.data;
  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="promotions-heading" className="py-20 bg-moto-surface/50 border-b border-moto-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-widest text-moto-copper uppercase mb-2 block">Exclusive Offers</span>
          <h2 id="promotions-heading" className="text-3xl sm:text-5xl font-bold tracking-wider text-moto-text uppercase">
            CURRENT PROMOTIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => {
            const key = `${promo.title ?? "promo"}-${promo.starts_at ?? ""}-${promo.brand?.slug ?? "global"}`;
            const brandAccent = promo.brand?.accent_color;
            return (
              <div key={key} className="bg-moto-surface border border-moto-border p-6 rounded-lg space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  {promo.brand && (
                    <span
                      className="inline-block text-xs font-mono px-2.5 py-1 rounded border uppercase"
                      style={{
                        borderColor: brandAccent ? `${brandAccent}50` : undefined,
                        backgroundColor: brandAccent ? `${brandAccent}15` : undefined,
                        color: brandAccent || undefined,
                      }}
                    >
                      {promo.brand.name}
                    </span>
                  )}
                  {promo.image_url && (
                    <div className="relative h-48 w-full rounded overflow-hidden bg-moto-bg">
                      <Image src={promo.image_url} alt={promo.title ?? "Promotion"} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <h3 className="text-xl font-bold font-barlow tracking-wider text-moto-text uppercase">{promo.title}</h3>
                  <p className="text-sm text-moto-muted">{promo.description}</p>
                </div>
                {promo.ends_at && (
                  <div className="text-xs font-mono text-moto-copper pt-2 border-t border-moto-border/40">
                    Valid until {formatDate(promo.ends_at)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
