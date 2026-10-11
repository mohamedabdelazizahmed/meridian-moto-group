import type { Promotion } from "@/types/api";
import { Result } from "@/lib/result";
import { SectionError } from "./SectionError";

interface PromotionsSectionProps {
  promotionsResult: Result<Promotion[]>;
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
  if (promotions.length === 0) {
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
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-moto-surface border border-moto-border p-6 rounded-lg space-y-4">
              <span className="text-xs font-mono bg-moto-copper/20 text-moto-copper px-2.5 py-1 rounded border border-moto-copper/30 uppercase">
                {promo.code}
              </span>
              <h3 className="text-xl font-bold font-barlow tracking-wider text-moto-text uppercase">{promo.title}</h3>
              <p className="text-sm text-moto-muted">{promo.description}</p>
              {promo.discount_percentage && (
                <div className="text-xs font-mono text-moto-copper font-bold">
                  {promo.discount_percentage}% OFF
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
